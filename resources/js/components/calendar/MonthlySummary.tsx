import { CheckCircle } from 'lucide-react';

interface MonthlySummaryProps {
    completedClasses: number;
    monthName: string;
}

export default function MonthlySummary({ completedClasses, monthName }: MonthlySummaryProps) {
    return (
        <div className="h-full border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-lg">
            <div className="flex h-full flex-col justify-center p-4 text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">This Month</span>
                </div>
                <div className="mb-1 text-3xl font-bold text-green-600">{completedClasses}</div>
                <div className="text-sm text-green-700">{completedClasses === 1 ? 'Class' : 'Classes'} Completed</div>
                <div className="mt-1 text-xs text-green-600">{monthName}</div>
            </div>
        </div>
    );
}