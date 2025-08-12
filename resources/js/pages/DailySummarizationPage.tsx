import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileUploadBox } from '@/components/common/FileUploadBox';
import { NotesTextarea } from '@/components/common/NotesTextarea';
import { PreviewSection } from '@/components/common/PreviewSection';
import { DailyReportPreview } from '@/components/daily/DailyReportPreview';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Daily Summarization',
        href: '/daily-summary',
    },
];

interface ReportData {
    student_name: string;
    class_level: string;
    date: string;
    lesson_focus: string;
    student_performance: string;
    key_achievements: string;
    areas_for_improvement: string;
    skills_assessment: {
        [key: string]: {
            level: string;
            details: string;
        };
    };
    recommendations: string[];
    homework_exercises: Array<{
        type: string;
        description: string;
        estimated_time: string;
    }>;
}

export default function DailySummarizationPage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [error, setError] = useState<string>('');

    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
    };

    const handleGenerateReport = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload a lesson report file first.');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('pdf_file', uploadedFiles[0]);
            if (notes.trim()) {
                formData.append('notes', notes);
            }

            // Make API call to generate report
            const response = await fetch('/api/reports/daily/generate', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to generate report');
            }

            // Set the report data
            setReportData(result.data.report);
            setShowPreview(true);
            
            // Scroll to preview section
            setTimeout(() => {
                document.getElementById('preview-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } catch (err: any) {
            console.error('Report generation failed:', err);
            setError(err.message || 'An unexpected error occurred while generating the report.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!reportData) {
            alert('No report data available for download');
            return;
        }

        try {
            const response = await fetch('/api/reports/daily/download-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    report_data: reportData,
                    metadata: {
                        generated_at: new Date().toISOString(),
                        user_id: 'current_user' // This would be dynamic in a real app
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to download PDF');
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Extract filename from response headers or use default
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'ESL_Daily_Report.pdf';
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) {
                    filename = matches[1];
                }
            }
            
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error('PDF download failed:', err);
            alert(err.message || 'Failed to download PDF');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daily Progress Summary Generator" />
            
            <div className="min-h-screen bg-gradient-to-br from-[#f7fbfc] via-white to-[#f7fbfc] p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Link
                                href="/dashboard"
                                className="text-[#769fcd] hover:text-[#769fcd]/80 transition-colors"
                            >
                                <Icon name="ArrowLeft" className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Daily Progress Summary Generator
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Upload individual lesson reports to generate comprehensive daily summaries 
                            with personalized homework worksheets
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-6">
                        <FileUploadBox
                            title="Upload Lesson Report"
                            description="Upload your PDF lesson report to generate a daily summary"
                            acceptedFileTypes=".pdf"
                            multiple={false}
                            onFilesSelected={handleFileUpload}
                        />

                        <NotesTextarea
                            label="Additional Notes"
                            placeholder="Add any specific observations, student behavior notes, or particular areas you'd like emphasized in the summary..."
                            value={notes}
                            onChange={setNotes}
                            maxLength={500}
                        />

                        {/* Generate Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleGenerateReport}
                                disabled={isGenerating || uploadedFiles.length === 0}
                                size="lg"
                                className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white px-12 py-4 text-lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Icon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
                                        Generating Summary...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="FileText" className="h-5 w-5 mr-2" />
                                        Generate Daily Summary
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Status Message */}
                        {isGenerating && (
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-[#f7fbfc] border border-[#d6e6f2] rounded-full">
                                    <Icon name="Sparkles" className="h-4 w-4 mr-2 text-[#769fcd]" />
                                    <span className="text-sm text-gray-600">
                                        AI is analyzing your lesson report and generating personalized content...
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                                    <Icon name="AlertCircle" className="h-4 w-4 mr-2 text-red-600" />
                                    <span className="text-sm text-red-700">
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div id="preview-section">
                        <PreviewSection
                            title="Daily Progress Summary & Homework Worksheet"
                            isVisible={showPreview}
                            onDownload={handleDownload}
                        >
                            <DailyReportPreview data={reportData || undefined} />
                        </PreviewSection>
                    </div>

                    {/* Back to Dashboard */}
                    <div className="text-center pt-8">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-[#769fcd] hover:text-[#769fcd]/80 transition-colors font-medium"
                        >
                            <Icon name="ArrowLeft" className="h-4 w-4 mr-1" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}