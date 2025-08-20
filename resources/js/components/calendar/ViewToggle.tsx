import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ViewToggleProps {
    view: 'month' | 'list';
    onViewChange: (view: 'month' | 'list') => void;
    children: React.ReactNode;
}

export default function ViewToggle({ view, onViewChange, children }: ViewToggleProps) {
    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
            <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#2563eb]" />
                            {view === 'month' ? 'Calendar View' : 'List View'}
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewChange(view === 'month' ? 'list' : 'month')}
                            className="flex items-center gap-2 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:text-sm"
                        >
                            {view === 'month' ? (
                                <>
                                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    <span className="hidden sm:inline">Switch to List View</span>
                                    <span className="sm:hidden">List View</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="hidden sm:inline">Switch to Calendar View</span>
                                    <span className="sm:hidden">Calendar View</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-3 md:p-6">
                {children}
            </CardContent>
        </Card>
    );
}