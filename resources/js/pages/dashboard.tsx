import { ActionCard } from '@/components/common/ActionCard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, Calendar, GitCompare } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ESL Report Generator" />
            <div className="min-h-screen bg-gradient-to-br from-[#f7fbfc] via-white to-[#f7fbfc] p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight px-2">
                        ESL Report Generator
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Multi-Level Summarization System for ESL Teachers
                    </p>
                    <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto px-4 leading-relaxed">
                        Generate comprehensive progress reports, monthly summaries, and performance comparisons 
                        to track your students' English learning journey.
                    </p>
                </div>

                {/* Action Cards Grid */}
                <div className="max-w-7xl mx-auto px-2">
                    <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                        <ActionCard
                            title="Daily Summarization"
                            description="Upload individual lesson reports to generate daily progress summaries with personalized homework worksheets"
                            href="/daily-summary"
                            icon={FileText}
                            emoji="📝"
                        />
                        
                        <ActionCard
                            title="Monthly Summarization"
                            description="Aggregate monthly performance overviews with trends, achievements, and focus areas for continued growth"
                            href="/monthly-summary"
                            icon={Calendar}
                            emoji="📊"
                        />
                        
                        <ActionCard
                            title="Monthly Comparison"
                            description="Compare current month vs previous month performance with detailed improvement indicators and recommendations"
                            href="/monthly-comparison"
                            icon={GitCompare}
                            emoji="📈"
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12 sm:mt-14 md:mt-16 text-center px-4">
                    <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border-2 border-[#d6e6f2] shadow-sm hover:shadow-md transition-all duration-200">
                        <span className="text-xs sm:text-sm text-gray-500 text-center">
                            Phase 1: UI-only version • AI integration coming soon
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
