import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, Filter, Search, ChevronLeft, ChevronRight, CalendarDays, Trash2 } from 'lucide-react';

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

interface CalendarPageProps {
    classes: {
        data: ClassSchedule[];
        links: any[];
        meta: any;
    };
    students: Student[];
    todaysClasses: ClassSchedule[];
    filters: {
        student_id?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function CalendarPage({ classes, students, todaysClasses, filters }: CalendarPageProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'list'>('month');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<ClassSchedule | null>(null);
    const [calendarData, setCalendarData] = useState<{ [key: string]: ClassSchedule[] }>({});
    
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
        fetch(`/calendar/data?month=${monthKey}`)
            .then(res => res.json())
            .then(data => setCalendarData(data))
            .catch(console.error);
    }, [currentDate]);

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

    const getStatusBadge = (status: string) => {
        const colors = {
            upcoming: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
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
        if (minutes === 30) return '30 min';
        if (minutes === 60) return '1 hour';
        if (minutes === 90) return '1.5 hours';
        if (minutes === 120) return '2 hours';
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
                {todaysClasses.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Today's Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                            <Badge className={`text-xs ${getStatusBadge(classItem.status)}`}>
                                                {classItem.status}
                                            </Badge>
                                        </div>
                                        <Link href={`/schedules/${classItem.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                                            const dateA = new Date(`${a.class_date}T${a.start_time}`);
                                            const dateB = new Date(`${b.class_date}T${b.start_time}`);
                                            return dateB.getTime() - dateA.getTime();
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