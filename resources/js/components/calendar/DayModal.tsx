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

interface DayModalProps {
    isOpen: boolean;
    selectedDate: string;
    selectedDateClasses: ClassSchedule[];
    onClose: () => void;
    onUpdateClassStatus: (classItem: ClassSchedule, status: 'completed' | 'cancelled') => void;
}

export default function DayModal({
    isOpen,
    selectedDate,
    selectedDateClasses,
    onClose,
    onUpdateClassStatus,
}: DayModalProps) {
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

    const handleStatusUpdate = (classItem: ClassSchedule, status: 'completed' | 'cancelled') => {
        onUpdateClassStatus(classItem, status);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8" onClick={onClose}>
            <div
                className="mx-auto w-[95%] max-w-[95vw] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[55%] 2xl:w-[50%] max-h-[95vh] overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Classes on {selectedDate}</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="max-h-[60vh] overflow-y-auto px-4 py-4 sm:px-6">
                    {selectedDateClasses.length === 0 ? (
                        <div className="py-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <CalendarDays className="h-8 w-8 text-gray-400" />
                            </div>
                            <h4 className="mb-2 text-lg font-semibold text-gray-900">No classes scheduled</h4>
                            <p className="mb-6 text-sm text-gray-600">There are no classes scheduled for this date.</p>
                            <Link href="/schedules/create">
                                <Button
                                    onClick={onClose}
                                    className="bg-[#2563eb] text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Schedule a Class
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedDateClasses.map((classItem) => (
                                <div
                                    key={classItem.id}
                                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3">
                                        {/* Student and Time Info */}
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{classItem.student.name}</div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {formatTime(classItem.start_time)} • {getDurationText(classItem.duration_minutes)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {calculateClassCost(classItem) > 0 && (
                                                    <div className="rounded-full bg-green-50 px-3 py-1">
                                                        <span className="text-sm font-semibold text-green-700">
                                                            ${calculateClassCost(classItem).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                                <Badge className={`${getStatusBadge(classItem.status)} text-xs`}>
                                                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {classItem.notes && (
                                            <div className="rounded-md bg-gray-50 p-3">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium text-gray-700">Notes: </span>
                                                    {classItem.notes}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 border-t border-gray-100 pt-3">
                                            {classItem.status === 'upcoming' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(classItem, 'completed')}
                                                        className="flex-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-800"
                                                    >
                                                        <Check className="mr-1 h-3 w-3" />
                                                        Complete
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(classItem, 'cancelled')}
                                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800"
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
                                                    onClick={onClose}
                                                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
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
                    )}
                </div>
            </div>
        </div>
    );
}