import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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

export default function DailySummarizationPage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
    };

    const handleGenerateReport = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload a lesson report file first.');
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsGenerating(false);
        setShowPreview(true);
        
        // Scroll to preview section
        setTimeout(() => {
            document.getElementById('preview-section')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const handleDownload = () => {
        // Placeholder for PDF download functionality
        alert('PDF download functionality will be implemented in Phase 2');
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
                    </div>

                    {/* Preview Section */}
                    <div id="preview-section">
                        <PreviewSection
                            title="Daily Progress Summary & Homework Worksheet"
                            isVisible={showPreview}
                            onDownload={handleDownload}
                        >
                            <DailyReportPreview />
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