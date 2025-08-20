import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { CalendarDays, Check, Clock, Edit, Plus, User, X } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    price_amount?: number;
    duration_minutes?: number;
}

interface ClassSchedule {
    id: number;
    student: Student;
    class_date: string;
    start_time: string;
    duration_minutes: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    notes?: string;
}

interface TodaysClassesProps {
    todaysClasses: ClassSchedule[];
    onUpdateClassStatus: (classItem: ClassSchedule, status: 'completed' | 'cancelled') => void;
}

export default function TodaysClasses({ todaysClasses, onUpdateClassStatus }: TodaysClassesProps) {
    const getStatusBadge = (status: string) => {
        const colors = {
            upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status as keyof typeof colors] || colors.upcoming;
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getDurationText = (minutes: number) => {
        if (minutes === 25) return '25 min';
        if (minutes === 50) return '50 min';
        if (minutes === 60) return '1 hour';
        return `${minutes} min`;
    };

    const calculateClassCost = (classItem: ClassSchedule): number => {
        if (!classItem.student.price_amount || !classItem.student.duration_minutes || classItem.student.duration_minutes === 0) {
            return 0;
        }

        const pricePerMinute = classItem.student.price_amount / classItem.student.duration_minutes;
        return Math.round(pricePerMinute * classItem.duration_minutes * 100) / 100;
    };

    if (todaysClasses.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">No classes today</h3>
                <p className="mb-6 text-sm text-gray-600">You have no scheduled classes for today.</p>
                <Link href="/schedules/create">
                    <Button className="h-11 bg-[#2563eb] text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule a Class
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Desktop Table View - Hidden on small screens */}
            <div className="hidden md:block">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                                Student
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                                Time & Duration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                                Cost
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {todaysClasses.map((classItem) => (
                            <tr key={classItem.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{classItem.student.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {formatTime(classItem.start_time)} • {getDurationText(classItem.duration_minutes)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {calculateClassCost(classItem) > 0 && (
                                        <div className="rounded-full bg-green-50 px-3 py-1 text-center">
                                            <span className="text-sm font-semibold text-green-700">
                                                ${calculateClassCost(classItem).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <Badge className={`${getStatusBadge(classItem.status)} text-xs`}>
                                        {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1">
                                        {classItem.status === 'upcoming' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onUpdateClassStatus(classItem, 'completed')}
                                                    className="h-8 w-8 p-0 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onUpdateClassStatus(classItem, 'cancelled')}
                                                    className="h-8 w-8 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
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
            <div className="space-y-3 p-3 md:hidden">
                {todaysClasses.map((classItem) => (
                    <div
                        key={classItem.id}
                        className="rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{classItem.student.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                {formatTime(classItem.start_time)} •{' '}
                                                {getDurationText(classItem.duration_minutes)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Badge className={`${getStatusBadge(classItem.status)} text-xs`}>
                                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                </Badge>
                            </div>

                            {calculateClassCost(classItem) > 0 && (
                                <div className="rounded-full bg-green-50 px-3 py-1 text-center">
                                    <span className="text-sm font-semibold text-green-700">
                                        ${calculateClassCost(classItem).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {classItem.status === 'upcoming' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onUpdateClassStatus(classItem, 'completed')}
                                            className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                        >
                                            <Check className="mr-1 h-3 w-3" />
                                            Done
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onUpdateClassStatus(classItem, 'cancelled')}
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="mr-1 h-3 w-3" />
                                            Cancel
                                        </Button>
                                    </>
                                )}
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
    );
}