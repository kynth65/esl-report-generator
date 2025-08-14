import { ActionCard } from '@/components/common/ActionCard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText, Calendar, GitCompare, CalendarDays, CheckCircle, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

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
}

export default function Dashboard({ todaysClasses = [], monthlyCompletedClasses = 0, currentMonthName = '' }: DashboardProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<{ [key: string]: ClassSchedule[] }>({});
    
    // Load calendar data for current month
    useEffect(() => {
        const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
        fetch(`/calendar/data?month=${monthKey}`)
            .then(res => res.json())
            .then(response => {
                setCalendarData(response.classes || response);
            })
            .catch(console.error);
    }, [currentDate]);

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
            
            const dateKey = date.getFullYear() + '-' + 
                String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                String(date.getDate()).padStart(2, '0');
            const dayClasses = calendarData[dateKey] || [];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            
            currentWeek.push(
                <div
                    key={i}
                    className={`min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2 border border-gray-100 ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                    <div className={`text-xs sm:text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-blue-600' : ''}`}>
                        {date.getDate()}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                        {dayClasses.slice(0, 2).map((classItem: ClassSchedule, idx: number) => (
                            <div
                                key={idx}
                                className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded truncate ${getStatusBadge(classItem.status)}`}
                                title={`${classItem.student.name} - ${formatTime(classItem.start_time)} (${getDurationText(classItem.duration_minutes)})`}
                            >
                                {classItem.student.name}
                            </div>
                        ))}
                        {dayClasses.length > 2 && (
                            <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                +{dayClasses.length - 2}
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SUMMAFLOW - ESL Report Generator" />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent tracking-tight px-2">
                            SUMMAFLOW
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-[#2563eb] font-medium max-w-3xl mx-auto px-4">
                            ESL Report Generator
                        </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                        Generate comprehensive progress reports and manage your ESL classes with AI-powered insights.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Action Cards Grid */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <ActionCard
                            title="Daily Summarization"
                            description="Upload individual lesson reports to generate daily progress summaries with personalized homework worksheets"
                            href="/daily-summary"
                            icon={FileText}
                            emoji="📝"
                        />
                        
                        <ActionCard
                            title="Monthly Summarization"
                            description="Aggregate monthly performance overviews with trends, achievements, and focus areas for continued growth"
                            href="/monthly-summary"
                            icon={Calendar}
                            emoji="📊"
                        />
                        
                        <ActionCard
                            title="Monthly Comparison"
                            description="Compare current month vs previous month performance with detailed improvement indicators and recommendations"
                            href="/monthly-comparison"
                            icon={GitCompare}
                            emoji="📈"
                        />
                    </div>

                    {/* Dashboard Grid Layout */}
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                        {/* Today's Classes */}
                        <div className="lg:col-span-2">
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
                                                <div key={classItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 rounded-lg gap-3 sm:gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-600" />
                                                            <span className="font-medium">{classItem.student.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{formatTime(classItem.start_time)} ({getDurationText(classItem.duration_minutes)})</span>
                                                        </div>
                                                        <Badge className={`text-xs w-fit ${getStatusBadge(classItem.status)}`}>
                                                            {classItem.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                            <h3 className="text-sm font-medium text-gray-900 mb-1">No classes today</h3>
                                            <p className="text-xs text-gray-600">You have no scheduled classes for today.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Completed Classes */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div className="flex flex-col">
                                            <span>Completed</span>
                                            <span className="text-sm font-normal text-gray-600">
                                                {currentMonthName || new Date().toLocaleDateString('en-US', { month: 'long' })}
                                            </span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 mb-2">
                                            {monthlyCompletedClasses}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {monthlyCompletedClasses === 1 ? 'class completed' : 'classes completed'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <CardTitle>Class Calendar</CardTitle>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={goToToday}>
                                        Today
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <span className="font-medium text-sm sm:text-base ml-2">
                                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-0 overflow-x-auto">
                                {/* Calendar Headers */}
                                <div className="grid grid-cols-7 border-b min-w-[280px]">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="p-2 sm:p-3 text-center font-medium text-gray-600 bg-gray-50 text-xs sm:text-sm">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Calendar Grid */}
                                <div className="border-b border-gray-200 min-w-[280px]">
                                    {renderCalendar()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Info */}
                <div className="mt-8 sm:mt-10 text-center px-4">
                    <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#2563eb]/20 shadow-sm">
                        <span className="text-xs text-gray-600 text-center">
                            Powered by AI • Clean & Professional Reports
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
