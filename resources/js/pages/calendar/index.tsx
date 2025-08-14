import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, Filter, Search, ChevronLeft, ChevronRight, CalendarDays, Trash2, CheckCircle, Check, X, DollarSign } from 'lucide-react';

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

export default function CalendarPage({ classes, students, todaysClasses, monthlyCompletedClasses, currentMonthName, weeklyEarnings, filters }: CalendarPageProps) {
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
        search: ''
    });

    // Load calendar data for current month
    useEffect(() => {
        const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
        const params = new URLSearchParams({
            month: monthKey,
            ...(data.student_id !== 'all' && { student_id: data.student_id }),
            ...(data.status !== 'all' && { status: data.status }),
            ...(data.date_from && { date_from: data.date_from }),
            ...(data.date_to && { date_to: data.date_to })
        });
        
        fetch(`/calendar/data?${params.toString()}`)
            .then(res => res.json())
            .then(response => {
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
            search: ''
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
                }
            });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setClassToDelete(null);
    };

    const updateClassStatus = (classItem: ClassSchedule, status: 'completed' | 'cancelled') => {
        // Ensure start_time is in H:i format (remove seconds if present)
        const formattedStartTime = classItem.start_time.includes(':')
            ? classItem.start_time.split(':').slice(0, 2).join(':')
            : classItem.start_time;
            
        router.patch(`/schedules/${classItem.id}`, {
            student_id: classItem.student.id,
            class_date: classItem.class_date,
            start_time: formattedStartTime,
            duration_minutes: classItem.duration_minutes,
            status: status,
            notes: classItem.notes || ''
        }, {
            onSuccess: () => {
                // Refresh the entire page to get updated data
                router.reload({ only: ['todaysClasses', 'monthlyCompletedClasses', 'currentMonthName'] });
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status as keyof typeof colors] || colors.upcoming;
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
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
            day: 'numeric'
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
            
            const dateKey = date.getFullYear() + '-' + 
                String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                String(date.getDate()).padStart(2, '0');
            const dayClasses = calendarData[dateKey] || [];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            
            currentWeek.push(
                <div
                    key={i}
                    className={`min-h-[100px] p-2 border border-gray-100 ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                    <div className={`text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-blue-600' : ''}`}>
                        {date.getDate()}
                    </div>
                    <div className="space-y-1">
                        {dayClasses.slice(0, 3).map((classItem: ClassSchedule, idx: number) => (
                            <div
                                key={idx}
                                className={`text-xs p-1 rounded truncate cursor-pointer hover:scale-105 transition-transform ${getStatusBadge(classItem.status)}`}
                                title={`${classItem.student.name} - ${formatTime(classItem.start_time)} (${getDurationText(classItem.duration_minutes)})`}
                            >
                                {classItem.student.name}
                            </div>
                        ))}
                        {dayClasses.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                                +{dayClasses.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
            
            if (currentWeek.length === 7) {
                weeks.push(
                    <div key={weeks.length} className="grid grid-cols-7">
                        {currentWeek}
                    </div>
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
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Class Calendar</h1>
                        <p className="text-gray-600 mt-1">Schedule and manage your ESL classes</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setView(view === 'month' ? 'list' : 'month')}
                        >
                            {view === 'month' ? 'List View' : 'Calendar View'}
                        </Button>
                        <Link href="/schedules/create">
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule Class
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Student</label>
                                <Select value={data.student_id} onValueChange={(value) => setData('student_id', value)}>
                                    <SelectTrigger>
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
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
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
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">From Date</label>
                                <Input
                                    type="date"
                                    value={data.date_from}
                                    onChange={(e) => setData('date_from', e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">To Date</label>
                                <Input
                                    type="date"
                                    value={data.date_to}
                                    onChange={(e) => setData('date_to', e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <Button 
                                onClick={handleFilter} 
                                disabled={processing}
                                size="sm"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Apply Filters
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={clearFilters}
                                size="sm"
                            >
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Today's Classes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todaysClasses.length > 0 ? (
                            <div className="space-y-3">
                                {todaysClasses.map((classItem) => (
                                    <div key={classItem.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium">{classItem.student.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatTime(classItem.start_time)} ({getDurationText(classItem.duration_minutes)})</span>
                                            </div>
                                            {calculateClassCost(classItem) > 0 && (
                                                <div className="text-sm font-semibold text-green-600">
                                                    ${calculateClassCost(classItem).toFixed(2)}
                                                </div>
                                            )}
                                            <Badge className={`text-xs ${getStatusBadge(classItem.status)}`}>
                                                {classItem.status}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            {classItem.status === 'upcoming' && (
                                                <>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => updateClassStatus(classItem, 'completed')}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Complete
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => updateClassStatus(classItem, 'cancelled')}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            <Link href={`/schedules/${classItem.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No classes today</h3>
                                <p className="text-gray-600">You have no scheduled classes for today.</p>
                                <Link href="/schedules/create">
                                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule a Class
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Total Completed Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Completed Classes - {currentMonthDisplayName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-green-600">
                                    {currentMonthCompleted}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {currentMonthCompleted === 1 ? 'class completed' : 'classes completed'} in {currentMonthDisplayName}
                                    {(filters.student_id && filters.student_id !== 'all') && ' (filtered by student)'}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">
                                    {currentMonthCompleted > 0 ? 'Great progress this month!' : 'Ready to start teaching?'}
                                </div>
                                <Link href="/schedules/create">
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar/List View */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                {view === 'month' ? 'Calendar View' : 'List View'}
                            </CardTitle>
                            {view === 'month' && (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={goToToday}>
                                        Today
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <span className="ml-4 font-medium">
                                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {view === 'month' ? (
                            <div className="space-y-0">
                                {/* Calendar Headers */}
                                <div className="grid grid-cols-7 border-b">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Calendar Grid */}
                                <div className="border-b border-gray-200">
                                    {renderCalendar()}
                                </div>
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-4">
                                {classes.data.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                                        <p className="text-gray-600">Try adjusting your filters or schedule a new class.</p>
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
                                        <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-600" />
                                                    <span className="font-medium">{formatDate(classItem.class_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatTime(classItem.start_time)} ({getDurationText(classItem.duration_minutes)})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                    <span>{classItem.student.name}</span>
                                                </div>
                                                {calculateClassCost(classItem) > 0 && (
                                                    <div className="text-sm font-semibold text-green-600">
                                                        ${calculateClassCost(classItem).toFixed(2)}
                                                    </div>
                                                )}
                                                <Badge className={`text-xs ${getStatusBadge(classItem.status)}`}>
                                                    {classItem.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/schedules/${classItem.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(classItem)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                {/* Pagination */}
                                {classes.links && classes.links.length > 3 && (
                                    <div className="flex justify-center gap-2 mt-6">
                                        {classes.links.map((link: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded text-sm ${
                                                    link.active
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                Weekly Earnings Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Week Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => navigateWeek('prev')}
                                    disabled={currentWeekIndex === 0}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous Week
                                </Button>
                                
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {currentWeek ? currentWeek.week_label : 'No data'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Week {currentWeekIndex + 1} of {weeklyEarnings.length}
                                        {filters.student_id && filters.student_id !== 'all' && ' (filtered by student)'}
                                    </p>
                                </div>
                                
                                <Button 
                                    variant="outline"
                                    onClick={() => navigateWeek('next')}
                                    disabled={currentWeekIndex >= weeklyEarnings.length - 1}
                                    className="flex items-center gap-2"
                                >
                                    Next Week
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {currentWeek && (
                                <>
                                    {/* Week Total */}
                                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-800 font-medium text-lg">Total Earnings This Week:</span>
                                            <span className="text-2xl font-bold text-green-900">
                                                ${currentWeek.total_earnings.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-green-700 text-sm mt-2">
                                            {currentWeek.classes.length} {currentWeek.classes.length === 1 ? 'class' : 'classes'} completed
                                        </p>
                                    </div>

                                    {/* Classes in this week */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Completed Classes This Week</h4>
                                        {currentWeek.classes.map((classItem) => (
                                            <div key={classItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-600" />
                                                        <Link 
                                                            href={`/students/${classItem.student_id}`}
                                                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {classItem.student_name}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="font-medium">{classItem.class_date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{classItem.start_time} ({classItem.duration_hours})</span>
                                                    </div>
                                                    {classItem.price && classItem.price > 0 && (
                                                        <div className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                                                            ${classItem.price.toFixed(2)}
                                                        </div>
                                                    )}
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm">
                                                        completed
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
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
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">{weeklyEarnings.length}</div>
                                        <div className="text-sm text-gray-600">
                                            {weeklyEarnings.length === 1 ? 'Week' : 'Weeks'} with Classes
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {weeklyEarnings.reduce((sum, week) => sum + week.classes.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Completed Classes</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            ${weeklyEarnings.reduce((sum, week) => sum + week.total_earnings, 0).toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Earnings</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Class</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete the class for{' '}
                            <span className="font-medium">{classToDelete?.student.name}</span> on{' '}
                            <span className="font-medium">{classToDelete && formatDate(classToDelete.class_date)}</span> at{' '}
                            <span className="font-medium">{classToDelete && formatTime(classToDelete.start_time)}</span>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={cancelDelete}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}