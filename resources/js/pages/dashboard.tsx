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
    stats?: {
        total_students: number;
        total_classes_today: number;
        completed_classes_today: number;
        upcoming_classes_today: number;
    };
}

export default function Dashboard({ 
    todaysClasses = [], 
    monthlyCompletedClasses = 0, 
    currentMonthName = '', 
    stats 
}: DashboardProps) {
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
                    {/* Quick Stats Row */}
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg sm:text-2xl font-bold truncate">{stats?.total_students || 0}</p>
                                    <p className="text-xs text-gray-600">Total Students</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg sm:text-2xl font-bold truncate">{monthlyCompletedClasses}</p>
                                    <p className="text-xs text-gray-600">This Month</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg sm:text-2xl font-bold truncate">{stats?.total_classes_today || 0}</p>
                                    <p className="text-xs text-gray-600">Today's Classes</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg sm:text-2xl font-bold truncate">{stats?.upcoming_classes_today || 0}</p>
                                    <p className="text-xs text-gray-600">Upcoming</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
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

                    {/* Main Content Grid */}
                    <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
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
                                                <div key={classItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 gap-3">
                                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">{classItem.student.name}</p>
                                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                                <span>{formatTime(classItem.start_time)} • {getDurationText(classItem.duration_minutes)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className={`${getStatusBadge(classItem.status)} border-0 font-medium px-2 sm:px-3 py-1 text-xs flex-shrink-0`}>
                                                        {classItem.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No classes scheduled</h3>
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
                                    <div className="text-center space-y-4">
                                        <div>
                                            <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                                                {monthlyCompletedClasses}
                                            </div>
                                            <p className="text-gray-600 font-medium">
                                                {monthlyCompletedClasses === 1 ? 'Class' : 'Classes'} Completed
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                in {currentMonthName || new Date().toLocaleDateString('en-US', { month: 'long' })}
                                            </p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-gray-100 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs sm:text-sm text-gray-600">Today's Progress</span>
                                                <span className="text-xs sm:text-sm font-semibold">{stats?.completed_classes_today || 0}/{stats?.total_classes_today || 0}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                                    style={{ 
                                                        width: `${((stats?.completed_classes_today || 0) / Math.max(stats?.total_classes_today || 1, 1)) * 100}%` 
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
                        <CardContent className="p-0 sm:p-6">
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