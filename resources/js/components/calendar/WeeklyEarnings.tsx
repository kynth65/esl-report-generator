import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, User } from 'lucide-react';

interface WeeklyEarning {
    week_start: string;
    week_end: string;
    week_label: string;
    total_earnings: number;
    classes: {
        id: number;
        student_name: string;
        student_id: number;
        class_date: string;
        start_time: string;
        duration_minutes: number;
        duration_hours: string;
        notes?: string;
        price: number;
    }[];
}

interface WeeklyEarningsProps {
    weeklyEarnings: WeeklyEarning[];
    currentWeekIndex: number;
    onNavigateWeek: (direction: 'prev' | 'next') => void;
    isFiltered?: boolean;
}

export default function WeeklyEarnings({
    weeklyEarnings,
    currentWeekIndex,
    onNavigateWeek,
    isFiltered = false,
}: WeeklyEarningsProps) {
    if (weeklyEarnings.length === 0) {
        return null;
    }

    const currentWeek = weeklyEarnings[currentWeekIndex];

    return (
        <div className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg">
            <div className="rounded-t-lg bg-gradient-to-r to-white p-4 sm:p-6">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Weekly Earnings Overview</h3>
                </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
                {/* Week Navigation */}
                <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:mb-6 sm:flex-row sm:gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigateWeek('prev')}
                        disabled={currentWeekIndex === 0}
                        className="flex w-full items-center gap-2 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:w-auto sm:text-sm"
                    >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Previous Week</span>
                        <span className="sm:hidden">Prev</span>
                    </Button>

                    <div className="text-center">
                        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                            {currentWeek ? currentWeek.week_label : 'No data'}
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm">
                            Week {currentWeekIndex + 1} of {weeklyEarnings.length}
                            {isFiltered && ' (filtered by student)'}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigateWeek('next')}
                        disabled={currentWeekIndex >= weeklyEarnings.length - 1}
                        className="flex w-full items-center gap-2 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:w-auto sm:text-sm"
                    >
                        <span className="hidden sm:inline">Next Week</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>

                {currentWeek && (
                    <>
                        {/* Week Total */}
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 sm:mb-6 sm:p-4 md:p-6">
                            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                <span className="text-sm font-medium text-green-800 sm:text-base md:text-lg">
                                    Total Earnings This Week:
                                </span>
                                <span className="text-xl font-bold text-green-900 sm:text-2xl">
                                    ${currentWeek.total_earnings.toFixed(2)}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-green-700 sm:text-sm">
                                {currentWeek.classes.length} {currentWeek.classes.length === 1 ? 'class' : 'classes'} completed
                            </p>
                        </div>

                        {/* Classes in this week */}
                        <div className="space-y-3">
                            <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
                                Completed Classes This Week
                            </h4>
                            <div className="overflow-x-auto">
                                {/* Desktop Table View - Hidden on small screens */}
                                <div className="hidden md:block max-h-[400px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Student
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Date & Time
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Duration
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Cost
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {currentWeek.classes.map((classItem) => (
                                                <tr key={classItem.id} className="transition-colors hover:bg-gray-50">
                                                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                        <div className="flex items-center">
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                                                                <User className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                                                            </div>
                                                            <div className="ml-3 sm:ml-4">
                                                                <Link
                                                                    href={`/students/${classItem.student_id}`}
                                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline sm:text-base"
                                                                >
                                                                    {classItem.student_name}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                {classItem.class_date}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                {classItem.start_time}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                        <div className="text-sm text-gray-600">
                                                            {classItem.duration_hours}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                        {classItem.price && classItem.price > 0 && (
                                                            <div className="rounded-full bg-green-50 px-3 py-1 text-center">
                                                                <span className="text-sm font-semibold text-green-700">
                                                                    ${classItem.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                        <Badge className="border-blue-200 bg-blue-100 text-xs text-blue-800">
                                                            completed
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-4 text-right whitespace-nowrap sm:px-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Link href={`/schedules/${classItem.id}/edit`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View - Shown on small screens */}
                                <div className="max-h-[400px] space-y-3 overflow-y-auto md:hidden">
                                    {currentWeek.classes.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={`/students/${classItem.student_id}`}
                                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {classItem.student_name}
                                                            </Link>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Calendar className="h-3 w-3" />
                                                                {classItem.class_date}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Clock className="h-3 w-3" />
                                                                <span>
                                                                    {classItem.start_time} ({classItem.duration_hours})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <Badge className="border-blue-200 bg-blue-100 text-xs text-blue-800">
                                                            completed
                                                        </Badge>
                                                        {classItem.price && classItem.price > 0 && (
                                                            <div className="rounded-full bg-green-50 px-3 py-1 text-center">
                                                                <span className="text-sm font-semibold text-green-700">
                                                                    ${classItem.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link href={`/schedules/${classItem.id}/edit`} className="flex-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Edit className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Summary */}
                <div className="mt-6 rounded-lg bg-gray-50 p-3 sm:mt-8 sm:p-4">
                    <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
                        <div>
                            <div className="text-xl font-bold text-blue-600 sm:text-2xl">{weeklyEarnings.length}</div>
                            <div className="text-xs text-gray-600 sm:text-sm">
                                {weeklyEarnings.length === 1 ? 'Week' : 'Weeks'} with Classes
                            </div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-600 sm:text-2xl">
                                {weeklyEarnings.reduce((sum, week) => sum + week.classes.length, 0)}
                            </div>
                            <div className="text-xs text-gray-600 sm:text-sm">Total Completed Classes</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-purple-600 sm:text-2xl">
                                ${weeklyEarnings.reduce((sum, week) => sum + week.total_earnings, 0).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600 sm:text-sm">Total Earnings</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}