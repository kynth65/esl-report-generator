import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileUploadBox } from '@/components/common/FileUploadBox';
import { NotesTextarea } from '@/components/common/NotesTextarea';
import { PreviewSection } from '@/components/common/PreviewSection';
import { MonthlyReportPreview } from '@/components/monthly/MonthlyReportPreview';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function MonthlySummarizationPage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [notes, setNotes] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
    };

    const handleGenerateReport = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one lesson report or data file.');
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
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

    const currentDate = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), i, 1);
        return {
            value: date.toISOString().slice(0, 7),
            label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
    });

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
                            Generate comprehensive monthly overviews with trends, achievements, 
                            and focus areas for continued growth
                        </p>
                    </div>

                    {/* Configuration Section */}
                    <Card className="border-[#d6e6f2] bg-gradient-to-r from-[#f7fbfc] to-white">
                        <CardContent className="p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Icon name="Settings" className="h-5 w-5 mr-2 text-[#769fcd]" />
                                Report Configuration
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Student/Class Selection
                                    </label>
                                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                        <SelectTrigger className="border-[#d6e6f2] focus:ring-[#769fcd]">
                                            <SelectValue placeholder="Select student or class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="john-doe">John Doe - Intermediate</SelectItem>
                                            <SelectItem value="jane-smith">Jane Smith - Advanced</SelectItem>
                                            <SelectItem value="class-a1">Class A1 - Beginner</SelectItem>
                                            <SelectItem value="class-b2">Class B2 - Upper Intermediate</SelectItem>
                                            <SelectItem value="custom">Custom Selection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Report Month
                                    </label>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="border-[#d6e6f2] focus:ring-[#769fcd]">
                                            <SelectValue placeholder="Select reporting period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem key={month.value} value={month.value}>
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Section */}
                    <div className="space-y-6">
                        <FileUploadBox
                            title="Upload Monthly Data"
                            description="Upload multiple lesson reports, attendance data, or assessment files from the selected month"
                            acceptedFileTypes=".pdf,.csv,.xlsx,.docx"
                            multiple={true}
                            onFilesSelected={handleFileUpload}
                        />

                        <NotesTextarea
                            label="Monthly Notes"
                            placeholder="Add any specific monthly observations, notable events, class dynamics, or particular focus areas you'd like emphasized in the summary..."
                            value={notes}
                            onChange={setNotes}
                            maxLength={800}
                            rows={5}
                        />

                        {/* Progress Indicators */}
                        {uploadedFiles.length > 0 && (
                            <Card className="border-[#d6e6f2] bg-[#f7fbfc]/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Icon name="CheckCircle" className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {uploadedFiles.length} file(s) ready for processing
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            AI will analyze all files to create comprehensive monthly insights
                                        </div>
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
                                className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white px-12 py-4 text-lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Icon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
                                        Analyzing Monthly Data...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Calendar" className="h-5 w-5 mr-2" />
                                        Generate Monthly Summary
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Status Message */}
                        {isGenerating && (
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 bg-[#f7fbfc] border border-[#d6e6f2] rounded-full">
                                    <Icon name="Brain" className="h-4 w-4 mr-2 text-[#769fcd]" />
                                    <span className="text-sm text-gray-600">
                                        AI is processing monthly data, identifying trends, and generating comprehensive insights...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div id="preview-section">
                        <PreviewSection
                            title="Monthly Progress Summary Report"
                            isVisible={showPreview}
                            onDownload={handleDownload}
                        >
                            <MonthlyReportPreview />
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