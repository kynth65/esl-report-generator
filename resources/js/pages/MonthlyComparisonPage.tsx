import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileUploadBox } from '@/components/common/FileUploadBox';
import { NotesTextarea } from '@/components/common/NotesTextarea';
import { PreviewSection } from '@/components/common/PreviewSection';
import { ComparisonReportPreview } from '@/components/comparison/ComparisonReportPreview';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Monthly Comparison',
        href: '/monthly-comparison',
    },
];

export default function MonthlyComparisonPage() {
    const [currentMonthFiles, setCurrentMonthFiles] = useState<File[]>([]);
    const [previousMonthFiles, setPreviousMonthFiles] = useState<File[]>([]);
    const [notes, setNotes] = useState('');
    const [currentMonthPeriod, setCurrentMonthPeriod] = useState('');
    const [previousMonthPeriod, setPreviousMonthPeriod] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleCurrentMonthUpload = (files: File[]) => {
        setCurrentMonthFiles(files);
    };

    const handlePreviousMonthUpload = (files: File[]) => {
        setPreviousMonthFiles(files);
    };

    const handleGenerateReport = async () => {
        if (currentMonthFiles.length === 0 || previousMonthFiles.length === 0) {
            alert('Please upload data files for both current and previous months.');
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 4000));
        
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

    // Get current and previous month defaults
    const currentDate = new Date();
    const currentMonthDefault = currentDate.toISOString().slice(0, 7);
    const previousMonthDefault = new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toISOString().slice(0, 7);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monthly Comparison Report Generator" />
            
            <div className="min-h-screen bg-gradient-to-br from-[#f7fbfc] via-white to-[#f7fbfc] p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
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
                                Monthly Comparison Report Generator
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Compare current month vs previous month performance with detailed improvement 
                            indicators and strategic recommendations
                        </p>
                    </div>

                    {/* Comparison Period Configuration */}
                    <Card className="border-[#d6e6f2] bg-gradient-to-r from-[#f7fbfc] to-white">
                        <CardHeader className="pb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Icon name="Calendar" className="h-5 w-5 mr-2 text-[#769fcd]" />
                                Comparison Period Selection
                            </h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="previous-month" className="text-sm font-medium text-gray-700">
                                        Previous Month Period
                                    </Label>
                                    <Input
                                        id="previous-month"
                                        type="month"
                                        value={previousMonthPeriod || previousMonthDefault}
                                        onChange={(e) => setPreviousMonthPeriod(e.target.value)}
                                        className="border-[#d6e6f2] focus:ring-[#769fcd]"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="current-month" className="text-sm font-medium text-gray-700">
                                        Current Month Period
                                    </Label>
                                    <Input
                                        id="current-month"
                                        type="month"
                                        value={currentMonthPeriod || currentMonthDefault}
                                        onChange={(e) => setCurrentMonthPeriod(e.target.value)}
                                        className="border-[#d6e6f2] focus:ring-[#769fcd]"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dual Upload Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Previous Month Data */}
                        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                            <CardHeader className="text-center pb-4">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center">
                                    <Icon name="ArrowLeft" className="h-5 w-5 mr-2" />
                                    Previous Month Data
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Upload reports and data from the previous month for baseline comparison
                                </p>
                            </CardHeader>
                            <CardContent>
                                <FileUploadBox
                                    title="Upload Previous Month Files"
                                    description="Upload lesson reports, assessments, or progress data"
                                    acceptedFileTypes=".pdf,.csv,.xlsx,.docx"
                                    multiple={true}
                                    onFilesSelected={handlePreviousMonthUpload}
                                    className="border-gray-300"
                                />
                            </CardContent>
                        </Card>

                        {/* Current Month Data */}
                        <Card className="border-2 border-[#769fcd] bg-gradient-to-br from-[#f7fbfc] to-white">
                            <CardHeader className="text-center pb-4">
                                <h3 className="text-lg font-semibold text-[#769fcd] flex items-center justify-center">
                                    <Icon name="ArrowRight" className="h-5 w-5 mr-2" />
                                    Current Month Data
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Upload current month reports and data for performance comparison
                                </p>
                            </CardHeader>
                            <CardContent>
                                <FileUploadBox
                                    title="Upload Current Month Files"
                                    description="Upload recent lesson reports, assessments, or progress data"
                                    acceptedFileTypes=".pdf,.csv,.xlsx,.docx"
                                    multiple={true}
                                    onFilesSelected={handleCurrentMonthUpload}
                                    className="border-[#769fcd]"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upload Status */}
                    {(currentMonthFiles.length > 0 || previousMonthFiles.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card className={`border ${previousMonthFiles.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Previous Month</span>
                                        <div className="flex items-center space-x-2">
                                            <Icon 
                                                name={previousMonthFiles.length > 0 ? "CheckCircle" : "Clock"} 
                                                className={`h-4 w-4 ${previousMonthFiles.length > 0 ? 'text-green-600' : 'text-gray-400'}`} 
                                            />
                                            <span className="text-sm text-gray-600">
                                                {previousMonthFiles.length} file(s)
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className={`border ${currentMonthFiles.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Current Month</span>
                                        <div className="flex items-center space-x-2">
                                            <Icon 
                                                name={currentMonthFiles.length > 0 ? "CheckCircle" : "Clock"} 
                                                className={`h-4 w-4 ${currentMonthFiles.length > 0 ? 'text-green-600' : 'text-gray-400'}`} 
                                            />
                                            <span className="text-sm text-gray-600">
                                                {currentMonthFiles.length} file(s)
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Comparison Notes */}
                    <NotesTextarea
                        label="Comparison Notes"
                        placeholder="Add any context about changes in teaching methods, student circumstances, class dynamics, or specific areas you want the comparison to focus on..."
                        value={notes}
                        onChange={setNotes}
                        maxLength={1000}
                        rows={4}
                    />

                    {/* Generate Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={handleGenerateReport}
                            disabled={isGenerating || currentMonthFiles.length === 0 || previousMonthFiles.length === 0}
                            size="lg"
                            className="bg-[#769fcd] hover:bg-[#769fcd]/90 text-white px-12 py-4 text-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Icon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
                                    Generating Comparison Analysis...
                                </>
                            ) : (
                                <>
                                    <Icon name="GitCompare" className="h-5 w-5 mr-2" />
                                    Generate Comparison Report
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Status Message */}
                    {isGenerating && (
                        <div className="text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-[#f7fbfc] border border-[#d6e6f2] rounded-full">
                                <Icon name="TrendingUp" className="h-4 w-4 mr-2 text-[#769fcd]" />
                                <span className="text-sm text-gray-600">
                                    AI is performing deep comparison analysis, identifying trends, and generating improvement insights...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Preview Section */}
                    <div id="preview-section">
                        <PreviewSection
                            title="Monthly Comparison Analysis Report"
                            isVisible={showPreview}
                            onDownload={handleDownload}
                        >
                            <ComparisonReportPreview />
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