import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileUploadBox } from '@/components/common/FileUploadBox';
import { NotesTextarea } from '@/components/common/NotesTextarea';
import { PreviewSection } from '@/components/common/PreviewSection';
import { MonthlyReportPreview } from '@/components/monthly/MonthlyReportPreview';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Monthly Summarization',
        href: '/monthly-summary',
    },
];

interface MonthlyReportData {
    period: string;
    total_sessions: number;
    overall_progress: {
        summary: string;
        achievements: string[];
        improvements: string[];
        focus_areas: string[];
    };
    skills_progression: {
        [key: string]: {
            initial_level: string;
            current_level: string;
            improvement_percentage: number;
            highlights: string[];
        };
    };
    consistency_metrics: {
        attendance_rate: number;
        engagement_level: number;
        homework_completion: number;
        participation_score: number;
    };
    recommendations: string[];
    next_month_goals: string[];
}

export default function MonthlySummarizationPage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
    const [error, setError] = useState<string>('');
    const [generationProgress, setGenerationProgress] = useState<string>('');
    const { playSound } = useNotificationSound();

    // Progress tracking for generation
    useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        
        if (isGenerating) {
            const progressSteps = [
                'Processing uploaded daily reports...',
                'Analyzing student progress patterns...',
                'Generating monthly insights...',
                'Creating skills progression analysis...',
                'Finalizing comprehensive summary...'
            ];
            
            let currentStep = 0;
            setGenerationProgress(progressSteps[0]);
            
            progressInterval = setInterval(() => {
                currentStep = (currentStep + 1) % progressSteps.length;
                setGenerationProgress(progressSteps[currentStep]);
            }, 4000);
        }
        
        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [isGenerating]);

    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
    };

    const handleGenerateReport = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one daily report PDF.');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            // Create FormData for multiple file upload
            const formData = new FormData();
            uploadedFiles.forEach((file, index) => {
                formData.append(`pdf_files[${index}]`, file);
            });
            if (notes.trim()) {
                formData.append('notes', notes);
            }

            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Make API call to generate monthly report
            const response = await fetch('/api/reports/monthly/generate', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to generate monthly report');
            }

            // Set the report data
            setReportData(result.data.report);
            setShowPreview(true);
            
            // Play success notification sound
            playSound('success');
            
            // Scroll to preview section
            setTimeout(() => {
                document.getElementById('preview-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } catch (err: any) {
            console.error('Monthly report generation failed:', err);
            setError(err.message || 'An unexpected error occurred while generating the monthly report.');
            playSound('error');
        } finally {
            setIsGenerating(false);
            setGenerationProgress('');
        }
    };

    const handleDownload = async () => {
        if (!reportData) {
            alert('No report data available for download');
            return;
        }

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/api/reports/monthly/download-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    report_data: reportData,
                    metadata: {
                        generated_at: new Date().toISOString(),
                        user_id: 'current_user'
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
            let filename = 'ESL_Monthly_Report.pdf';
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
            <Head title="Monthly Progress Summary Generator" />
            
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
                                Monthly Progress Summary Generator
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Upload multiple daily report PDFs to generate comprehensive monthly progress analysis 
                            with insights, achievements, and learning trends
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-6">
                        <FileUploadBox
                            title="Upload Daily Reports"
                            description="Upload multiple daily report PDFs to analyze student progress patterns and generate comprehensive monthly insights"
                            acceptedFileTypes=".pdf"
                            multiple={true}
                            onFilesSelected={handleFileUpload}
                        />

                        <NotesTextarea
                            label="Additional Context"
                            placeholder="Add any specific monthly observations, notable events, class dynamics, or focus areas you'd like emphasized in the analysis..."
                            value={notes}
                            onChange={setNotes}
                            maxLength={1000}
                            rows={4}
                        />

                        {/* Progress Indicators */}
                        {uploadedFiles.length > 0 && (
                            <Card className="border-[#d6e6f2] bg-[#f7fbfc]/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Icon name="CheckCircle" className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {uploadedFiles.length} daily report{uploadedFiles.length > 1 ? 's' : ''} ready for analysis
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            AI will analyze progress patterns across all uploaded reports
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-blue-600">
                                        💡 Tip: More reports provide richer insights into learning patterns and trends
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Generate Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleGenerateReport}
                                disabled={isGenerating || uploadedFiles.length === 0}
                                size="lg"
                                className={`bg-gradient-to-r from-[#769fcd] to-[#b9d7ea] hover:from-[#769fcd]/90 hover:to-[#b9d7ea]/90 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                    isGenerating ? 'esl-generating animate-pulse-soft' : ''
                                }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Icon name="Sparkles" className="h-5 w-5 mr-2 animate-bounce-gentle" />
                                        <span className="animate-pulse">Analyzing Progress...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="TrendingUp" className="h-5 w-5 mr-2" />
                                        Generate Monthly Analysis
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Enhanced Status Message */}
                        {isGenerating && (
                            <div className="text-center animate-fadeInUp">
                                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f7fbfc] to-[#d6e6f2]/20 border border-[#b9d7ea]/30 rounded-full shadow-md backdrop-blur-sm">
                                    <div className="relative">
                                        <Icon name="Sparkles" className="h-5 w-5 mr-3 text-[#769fcd] animate-bounce-gentle" />
                                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#b9d7ea] rounded-full animate-ping"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {generationProgress || 'AI is analyzing your daily reports...'}
                                        </span>
                                        <div className="h-1.5 w-48 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#769fcd] to-[#b9d7ea] rounded-full animate-shimmer"></div>
                                        </div>
                                    </div>
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
                            title="Monthly Progress Analysis Report"
                            isVisible={showPreview}
                            onDownload={handleDownload}
                        >
                            <MonthlyReportPreview data={reportData || undefined} />
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