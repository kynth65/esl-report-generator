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
            <div className="min-h-screen bg-gradient-to-br from-[#f7fbfc] via-white to-[#f7fbfc] p-4 md:p-8">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                        ESL Report Generator
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Multi-Level Summarization System for ESL Teachers
                    </p>
                    <p className="text-base text-gray-500 max-w-2xl mx-auto">
                        Generate comprehensive progress reports, monthly summaries, and performance comparisons 
                        to track your students' English learning journey.
                    </p>
                </div>

                {/* Action Cards Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-3">
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
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-[#d6e6f2] shadow-sm">
                        <span className="text-sm text-gray-500">
                            Phase 1: UI-only version • AI integration coming soon
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
