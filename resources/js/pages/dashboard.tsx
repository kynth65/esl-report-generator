import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Student {
    id: number;
    name: string;
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

interface DashboardProps {
    todaysClasses?: ClassSchedule[];
    monthlyCompletedClasses?: number;
    currentMonthName?: string;
    stats?: {
        total_students: number;
        total_classes_today: number;
        completed_classes_today: number;
        upcoming_classes_today: number;
    };
}

export default function Dashboard({ todaysClasses = [], monthlyCompletedClasses = 0, currentMonthName = '', stats }: DashboardProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<{ [key: string]: ClassSchedule[] }>({});

    // Load calendar data for current month
    useEffect(() => {
        const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
        fetch(`/calendar/data?month=${monthKey}`)
            .then((res) => res.json())
            .then((response) => {
                setCalendarData(response.classes || response);
            })
            .catch(console.error);
    }, [currentDate]);

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

    // Calendar rendering function
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
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
                    className={`min-h-[60px] border border-gray-100 p-1 sm:min-h-[80px] sm:p-2 lg:min-h-[100px] ${
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
                    <div className="space-y-0.5 sm:space-y-1">
                        {dayClasses.slice(0, 2).map((classItem: ClassSchedule, idx: number) => (
                            <div
                                key={idx}
                                className={`truncate rounded p-0.5 text-[10px] sm:p-1 sm:text-xs ${getStatusBadge(classItem.status)}`}
                                title={`${classItem.student.name} - ${formatTime(classItem.start_time)} (${getDurationText(classItem.duration_minutes)})`}
                            >
                                {classItem.student.name}
                            </div>
                        ))}
                        {dayClasses.length > 2 && <div className="text-[10px] font-medium text-gray-500 sm:text-xs">+{dayClasses.length - 2}</div>}
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

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ESL Report Generator" />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        <Card className="p-3 transition-shadow hover:shadow-md sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2">
                                    <User className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold sm:text-2xl">{stats?.total_students || 0}</p>
                                    <p className="text-xs text-gray-600">Total Students</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-3 transition-shadow hover:shadow-md sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 rounded-lg bg-green-100 p-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold sm:text-2xl">{monthlyCompletedClasses}</p>
                                    <p className="text-xs text-gray-600">This Month</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-3 transition-shadow hover:shadow-md sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 rounded-lg bg-orange-100 p-2">
                                    <CalendarDays className="h-3 w-3 text-orange-600 sm:h-4 sm:w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold sm:text-2xl">{stats?.total_classes_today || 0}</p>
                                    <p className="text-xs text-gray-600">Today's Classes</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-3 transition-shadow hover:shadow-md sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 rounded-lg bg-purple-100 p-2">
                                    <Clock className="h-3 w-3 text-purple-600 sm:h-4 sm:w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold sm:text-2xl">{stats?.upcoming_classes_today || 0}</p>
                                    <p className="text-xs text-gray-600">Upcoming</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        {/* Today's Classes - Takes 2 columns on xl screens */}
                        <div className="xl:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5" />
                                        Today's Classes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    {todaysClasses.length > 0 ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            {todaysClasses.map((classItem) => (
                                                <div
                                                    key={classItem.id}
                                                    className="flex flex-col justify-between gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:flex-row sm:items-center sm:p-4"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                                                            <User className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-gray-900">{classItem.student.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                                <span>
                                                                    {formatTime(classItem.start_time)} • {getDurationText(classItem.duration_minutes)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        className={`${getStatusBadge(classItem.status)} flex-shrink-0 border-0 px-2 py-1 text-xs font-medium sm:px-3`}
                                                    >
                                                        {classItem.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center sm:py-12">
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                                                <CalendarDays className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                                            </div>
                                            <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">No classes scheduled</h3>
                                            <p className="text-sm text-gray-600">You have no classes scheduled for today.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Monthly Summary Card */}
                        <div className="xl:col-span-1">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Monthly Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="space-y-4 text-center">
                                        <div>
                                            <div className="mb-2 text-4xl font-bold text-green-600 sm:text-5xl">{monthlyCompletedClasses}</div>
                                            <p className="font-medium text-gray-600">
                                                {monthlyCompletedClasses === 1 ? 'Class' : 'Classes'} Completed
                                            </p>
                                            <p className="text-xs text-gray-500 sm:text-sm">
                                                in {currentMonthName || new Date().toLocaleDateString('en-US', { month: 'long' })}
                                            </p>
                                        </div>

                                        <div className="space-y-3 border-t border-gray-100 pt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600 sm:text-sm">Today's Progress</span>
                                                <span className="text-xs font-semibold sm:text-sm">
                                                    {stats?.completed_classes_today || 0}/{stats?.total_classes_today || 0}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-green-600 transition-all duration-300"
                                                    style={{
                                                        width: `${((stats?.completed_classes_today || 0) / Math.max(stats?.total_classes_today || 1, 1)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <CardTitle>Class Calendar</CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={goToToday}>
                                        Today
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <span className="ml-2 text-sm font-medium sm:text-base">
                                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="space-y-0 overflow-x-auto">
                                {/* Calendar Headers */}
                                <div className="grid min-w-[280px] grid-cols-7 border-b">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-600 sm:p-3 sm:text-sm">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="min-w-[280px] border-b border-gray-200">{renderCalendar()}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
