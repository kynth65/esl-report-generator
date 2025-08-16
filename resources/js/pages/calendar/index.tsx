import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Filter,
    Plus,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface CalendarPageProps {
    classes: {
        data: ClassSchedule[];
        links: any[];
        meta: any;
    };
    students: Student[];
    todaysClasses: ClassSchedule[];
    monthlyCompletedClasses: number;
    currentMonthName: string;
    weeklyEarnings: WeeklyEarning[];
    filters: {
        student_id?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function CalendarPage({
    classes,
    students,
    todaysClasses,
    monthlyCompletedClasses,
    currentMonthName,
    weeklyEarnings,
    filters,
}: CalendarPageProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'list'>('month');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<ClassSchedule | null>(null);
    const [calendarData, setCalendarData] = useState<{ [key: string]: ClassSchedule[] }>({});
    const [currentMonthCompleted, setCurrentMonthCompleted] = useState(monthlyCompletedClasses);
    const [currentMonthDisplayName, setCurrentMonthDisplayName] = useState(currentMonthName);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

    const { data, setData, get, processing } = useForm({
        student_id: filters.student_id || 'all',
        status: filters.status || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: '',
    });

    // Load calendar data for current month
    useEffect(() => {
        const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
        const params = new URLSearchParams({
            month: monthKey,
            ...(data.student_id !== 'all' && { student_id: data.student_id }),
            ...(data.status !== 'all' && { status: data.status }),
            ...(data.date_from && { date_from: data.date_from }),
            ...(data.date_to && { date_to: data.date_to }),
        });

        fetch(`/calendar/data?${params.toString()}`)
            .then((res) => res.json())
            .then((response) => {
                setCalendarData(response.classes || response);
                if (response.completedCount !== undefined) {
                    setCurrentMonthCompleted(response.completedCount);
                }
                if (response.monthName) {
                    setCurrentMonthDisplayName(response.monthName);
                }
            })
            .catch(console.error);
    }, [currentDate, data.student_id, data.status, data.date_from, data.date_to]);

    const handleFilter = () => {
        get('/calendar', { preserveState: true });
    };

    const clearFilters = () => {
        setData({
            student_id: 'all',
            status: 'all',
            date_from: '',
            date_to: '',
            search: '',
        });
        router.get('/calendar');
    };

    const handleDeleteClick = (classItem: ClassSchedule) => {
        setClassToDelete(classItem);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (classToDelete) {
            router.delete(`/schedules/${classToDelete.id}`, {
                onSuccess: () => {
                    setDeleteConfirmOpen(false);
                    setClassToDelete(null);
                },
            });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setClassToDelete(null);
    };

    const updateClassStatus = (classItem: ClassSchedule, status: 'completed' | 'cancelled') => {
        // Ensure start_time is in H:i format (remove seconds if present)
        const formattedStartTime = classItem.start_time.includes(':') ? classItem.start_time.split(':').slice(0, 2).join(':') : classItem.start_time;

        router.patch(
            `/schedules/${classItem.id}`,
            {
                student_id: classItem.student.id,
                class_date: classItem.class_date,
                start_time: formattedStartTime,
                duration_minutes: classItem.duration_minutes,
                status: status,
                notes: classItem.notes || '',
            },
            {
                onSuccess: () => {
                    // Refresh the entire page to get updated data
                    router.reload({ only: ['todaysClasses', 'monthlyCompletedClasses', 'currentMonthName'] });
                },
            },
        );
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calendar rendering
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
                    className={`min-h-[80px] border border-gray-100 p-1 sm:min-h-[100px] sm:p-2 ${
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

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const calculateClassCost = (classItem: ClassSchedule): number => {
        if (!classItem.student.price_amount || !classItem.student.duration_minutes || classItem.student.duration_minutes === 0) {
            return 0;
        }

        const pricePerMinute = classItem.student.price_amount / classItem.student.duration_minutes;
        return Math.round(pricePerMinute * classItem.duration_minutes * 100) / 100;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
        } else if (direction === 'next' && currentWeekIndex < weeklyEarnings.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
        }
    };

    const currentWeek = weeklyEarnings[currentWeekIndex];

    return (
        <AppLayout breadcrumbs={[{ title: 'Calendar', href: '/calendar' }]}>
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">Class Calendar</h2>
                            <p className="mt-1 hidden text-sm text-gray-600 sm:mt-2 sm:block sm:text-base md:text-lg">
                                Schedule and manage your ESL classes
                            </p>
                        </div>
                        <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
                            <Link href="/schedules/create" className="flex-1 sm:flex-none">
                                <Button
                                    size="sm"
                                    className="w-full bg-[#2563eb] px-3 text-xs font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:px-6 sm:text-sm"
                                >
                                    <Plus className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Schedule Class</span>
                                    <span className="sm:hidden">Schedule</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-[#2563eb]" />
                                Filter Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-4 sm:px-6 sm:py-6 md:px-8">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 sm:text-base">Student</label>
                                    <Select value={data.student_id} onValueChange={(value) => setData('student_id', value)}>
                                        <SelectTrigger className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base">
                                            <SelectValue placeholder="All students" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All students</SelectItem>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 sm:text-base">Status</label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 sm:text-base">From Date</label>
                                    <Input
                                        type="date"
                                        value={data.date_from}
                                        onChange={(e) => setData('date_from', e.target.value)}
                                        className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base"
                                    />
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 sm:text-base">To Date</label>
                                    <Input
                                        type="date"
                                        value={data.date_to}
                                        onChange={(e) => setData('date_to', e.target.value)}
                                        className="h-10 border-gray-300 text-sm sm:h-12 sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3 sm:mt-6 sm:gap-3 sm:pt-4">
                                <Button
                                    onClick={handleFilter}
                                    disabled={processing}
                                    size="sm"
                                    className="flex-1 bg-[#2563eb] text-xs text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:flex-none sm:text-sm"
                                >
                                    <Filter className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Apply Filters</span>
                                    <span className="sm:hidden">Apply</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    size="sm"
                                    className="flex-1 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:flex-none sm:text-sm"
                                >
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Classes */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-[#2563eb]" />
                                Today's Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            {todaysClasses.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {todaysClasses.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 transition-all duration-200 hover:shadow-md sm:p-4"
                                        >
                                            <div className="flex min-w-0 items-start gap-3 sm:items-center">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                                                    <User className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                                        {classItem.student.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                                        <span>
                                                            {formatTime(classItem.start_time)} • {getDurationText(classItem.duration_minutes)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {calculateClassCost(classItem) > 0 && (
                                                        <div className="rounded-full bg-green-50 px-2 py-1 sm:px-3">
                                                            <span className="text-xs font-semibold text-green-700 sm:text-sm">
                                                                ${calculateClassCost(classItem).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <Badge
                                                        className={`${getStatusBadge(classItem.status)} flex-shrink-0 border-0 px-2 py-1 text-xs font-medium sm:px-3`}
                                                    >
                                                        {classItem.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {classItem.status === 'upcoming' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateClassStatus(classItem, 'completed')}
                                                            className="flex-1 border-green-200 text-xs text-green-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:flex-none sm:text-sm"
                                                        >
                                                            <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span className="hidden sm:inline">Complete</span>
                                                            <span className="sm:hidden">Done</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateClassStatus(classItem, 'cancelled')}
                                                            className="flex-1 border-red-200 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:flex-none sm:text-sm"
                                                        >
                                                            <X className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                                <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 border-green-200 text-xs text-green-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:flex-none sm:text-sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
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
                            )}
                        </CardContent>
                    </Card>

                    {/* Total Completed Classes */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Completed Classes - {currentMonthDisplayName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="space-y-3 text-center sm:space-y-4">
                                <div>
                                    <div className="mb-2 text-3xl font-bold text-green-600 sm:text-4xl md:text-5xl">{currentMonthCompleted}</div>
                                    <p className="text-sm font-medium text-gray-600 sm:text-base">
                                        {currentMonthCompleted === 1 ? 'Class' : 'Classes'} Completed
                                    </p>
                                    <p className="text-xs text-gray-500 sm:text-sm">
                                        in {currentMonthDisplayName}
                                        {filters.student_id && filters.student_id !== 'all' && ' (filtered by student)'}
                                    </p>
                                </div>

                                <div className="space-y-2 border-t border-gray-100 pt-3 sm:space-y-3 sm:pt-4">
                                    <div className="text-xs text-gray-600 sm:text-sm">
                                        {currentMonthCompleted > 0 ? 'Great progress this month!' : 'Ready to start teaching?'}
                                    </div>
                                    <Link href="/schedules/create">
                                        <Button
                                            size="sm"
                                            className="bg-[#2563eb] text-xs text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:text-sm"
                                        >
                                            <Plus className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">Schedule More</span>
                                            <span className="sm:hidden">Schedule</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calendar/List View */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                            <div className="flex flex-col gap-4">
                                {/* Title and View Toggle */}
                                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-[#2563eb]" />
                                        {view === 'month' ? 'Calendar View' : 'List View'}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setView(view === 'month' ? 'list' : 'month')}
                                        className="flex items-center gap-2 border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:text-sm"
                                    >
                                        {view === 'month' ? (
                                            <>
                                                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                                    />
                                                </svg>
                                                <span className="hidden sm:inline">Switch to List View</span>
                                                <span className="sm:hidden">List View</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span className="hidden sm:inline">Switch to Calendar View</span>
                                                <span className="sm:hidden">Calendar View</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Calendar Navigation (only show in calendar view) */}
                                {view === 'month' && (
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
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-3 md:p-6">
                            {view === 'month' ? (
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
                            ) : (
                                /* List View */
                                <div className="space-y-3 px-3 sm:space-y-4 sm:px-6">
                                    {classes.data.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                                <Calendar className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900">No classes found</h3>
                                            <p className="mb-6 text-sm text-gray-600">Try adjusting your filters or schedule a new class.</p>
                                            <Link href="/schedules/create">
                                                <Button className="h-11 bg-[#2563eb] text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Schedule a Class
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        [...classes.data]
                                            .sort((a, b) => {
                                                // Create proper datetime objects for comparison
                                                const dateTimeA = new Date(`${a.class_date}T${a.start_time}`);
                                                const dateTimeB = new Date(`${b.class_date}T${b.start_time}`);
                                                const now = new Date();

                                                // Determine if classes are upcoming (including today's future classes)
                                                const aIsUpcoming = dateTimeA >= now;
                                                const bIsUpcoming = dateTimeB >= now;

                                                // Prioritize upcoming classes over past classes
                                                if (aIsUpcoming && !bIsUpcoming) return -1;
                                                if (!aIsUpcoming && bIsUpcoming) return 1;

                                                // For all classes (both upcoming and past), sort chronologically
                                                // Upcoming: earliest first (ascending)
                                                // Past: most recent first (descending)
                                                if (aIsUpcoming && bIsUpcoming) {
                                                    return dateTimeA.getTime() - dateTimeB.getTime();
                                                } else {
                                                    return dateTimeB.getTime() - dateTimeA.getTime();
                                                }
                                            })
                                            .map((classItem) => (
                                                <div
                                                    key={classItem.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-3 transition-all duration-200 hover:border-gray-200 hover:shadow-md sm:p-4"
                                                >
                                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Calendar className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            <span className="text-sm font-medium text-gray-900 sm:text-base">
                                                                {formatDate(classItem.class_date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span>
                                                                {formatTime(classItem.start_time)} ({getDurationText(classItem.duration_minutes)})
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            <span className="truncate text-sm font-medium sm:text-base">
                                                                {classItem.student.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {calculateClassCost(classItem) > 0 && (
                                                                <div className="rounded-full bg-green-50 px-2 py-1 sm:px-3">
                                                                    <span className="text-xs font-semibold text-green-700 sm:text-sm">
                                                                        ${calculateClassCost(classItem).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <Badge
                                                                className={`${getStatusBadge(classItem.status)} border-0 px-2 py-1 text-xs font-medium sm:px-3`}
                                                            >
                                                                {classItem.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-full text-xs transition-colors hover:bg-blue-50 hover:text-blue-700 sm:w-auto sm:text-sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(classItem)}
                                                            className="flex-1 text-xs text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 sm:flex-none sm:text-sm"
                                                        >
                                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                    )}

                                    {/* Pagination */}
                                    {classes.links && classes.links.length > 3 && (
                                        <div className="mt-6 flex justify-center gap-2">
                                            {classes.links.map((link: any, index: number) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`rounded px-3 py-2 text-sm ${
                                                        link.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    preserveState
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weekly Earnings */}
                    {weeklyEarnings.length > 0 && (
                        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                            <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Weekly Earnings Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 md:p-6">
                                {/* Week Navigation */}
                                <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:mb-6 sm:flex-row sm:gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigateWeek('prev')}
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
                                            {filters.student_id && filters.student_id !== 'all' && ' (filtered by student)'}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigateWeek('next')}
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
                                            {currentWeek.classes.map((classItem) => (
                                                <div
                                                    key={classItem.id}
                                                    className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 sm:p-4"
                                                >
                                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            <Link
                                                                href={`/students/${classItem.student_id}`}
                                                                className="truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline sm:text-base"
                                                            >
                                                                {classItem.student_name}
                                                            </Link>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span className="text-xs font-medium sm:text-sm">{classItem.class_date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span className="text-xs sm:text-sm">
                                                                {classItem.start_time} ({classItem.duration_hours})
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {classItem.price && classItem.price > 0 && (
                                                                <div className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 sm:px-3 sm:text-sm">
                                                                    ${classItem.price.toFixed(2)}
                                                                </div>
                                                            )}
                                                            <Badge className="border-blue-200 bg-blue-100 text-xs text-blue-800 sm:text-sm">
                                                                completed
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-full text-xs transition-colors hover:bg-blue-50 hover:text-blue-700 sm:w-auto sm:text-sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
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
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-3 sm:p-4">
                    <div className="mx-2 w-full max-w-md rounded-xl bg-white p-4 shadow-2xl sm:mx-4 sm:p-6">
                        <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">Delete Class</h3>
                        <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base">
                            Are you sure you want to delete the class for{' '}
                            <span className="font-semibold text-gray-900">{classToDelete?.student.name}</span> on{' '}
                            <span className="font-semibold text-gray-900">{classToDelete && formatDate(classToDelete.class_date)}</span> at{' '}
                            <span className="font-semibold text-gray-900">{classToDelete && formatTime(classToDelete.start_time)}</span>?
                        </p>
                        <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelDelete}
                                className="border-gray-300 text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 sm:text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={confirmDelete}
                                className="bg-red-600 text-xs text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl sm:text-sm"
                            >
                                Delete Class
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
