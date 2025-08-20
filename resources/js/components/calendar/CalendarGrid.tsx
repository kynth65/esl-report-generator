import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface CalendarGridProps {
    currentDate: Date;
    calendarData: { [key: string]: ClassSchedule[] };
    onDateChange: (date: Date) => void;
    onDayClick: (date: Date, dayClasses: ClassSchedule[]) => void;
}

export default function CalendarGrid({ 
    currentDate, 
    calendarData, 
    onDateChange, 
    onDayClick 
}: CalendarGridProps) {
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

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        onDateChange(newDate);
    };

    const goToToday = () => {
        onDateChange(new Date());
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks = [];
        let currentWeek = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            const dayClasses = calendarData[dateKey] || [];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();

            currentWeek.push(
                <div
                    key={i}
                    onClick={() => onDayClick(date, dayClasses)}
                    className={`min-h-[80px] cursor-pointer border border-gray-100 p-1 transition-colors hover:bg-gray-100 sm:min-h-[100px] sm:p-2 ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'border-blue-200 bg-blue-50' : ''}`}
                >
                    <div
                        className={`mb-1 text-xs font-medium sm:text-sm ${
                            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'text-blue-600' : ''}`}
                    >
                        {date.getDate()}
                    </div>
                    <div className="space-y-1">
                        {dayClasses.slice(0, 2).map((classItem: ClassSchedule, idx: number) => (
                            <div
                                key={idx}
                                className={`cursor-pointer truncate rounded p-1 text-xs transition-transform hover:scale-105 ${getStatusBadge(classItem.status)}`}
                                title={`${classItem.student.name} - ${formatTime(classItem.start_time)} (${getDurationText(classItem.duration_minutes)})`}
                            >
                                <span className="hidden sm:inline">{classItem.student.name}</span>
                                <span className="sm:hidden">{classItem.student.name.split(' ')[0]}</span>
                            </div>
                        ))}
                        {dayClasses.length > 2 && <div className="text-xs font-medium text-gray-500">+{dayClasses.length - 2}</div>}
                    </div>
                </div>,
            );

            if (currentWeek.length === 7) {
                weeks.push(
                    <div key={weeks.length} className="grid grid-cols-7">
                        {currentWeek}
                    </div>,
                );
                currentWeek = [];
            }
        }

        return weeks;
    };

    return (
        <div className="space-y-4">
            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-start sm:gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="border-gray-300 px-2 hover:bg-gray-50 hover:text-gray-900 sm:px-3"
                >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className="border-gray-300 px-2 text-xs hover:bg-gray-50 hover:text-gray-900 sm:px-3 sm:text-sm"
                >
                    Today
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="border-gray-300 px-2 hover:bg-gray-50 hover:text-gray-900 sm:px-3"
                >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="ml-1 text-xs font-medium sm:ml-2 sm:text-sm md:text-base">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* Calendar */}
            <div className="space-y-0 overflow-x-auto">
                {/* Calendar Headers */}
                <div className="grid min-w-[320px] grid-cols-7 border-b">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-600 sm:p-3 sm:text-sm">
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="min-w-[320px] border-b border-gray-200">{renderCalendar()}</div>
            </div>
        </div>
    );
}