import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarGrid, TodaysClasses, MonthlySummary, DayModal, useCalendarData, useClassOperations } from '@/components/calendar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays, CheckCircle, Check, Clock, User, X } from 'lucide-react';
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
    const [dayModalOpen, setDayModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDateClasses, setSelectedDateClasses] = useState<ClassSchedule[]>([]);

    // Calculate today's class statistics from actual data
    const todaysStats = {
        totalClasses: todaysClasses.length,
        completedClasses: todaysClasses.filter(cls => cls.status === 'completed').length,
        upcomingClasses: todaysClasses.filter(cls => cls.status === 'upcoming').length,
        cancelledClasses: todaysClasses.filter(cls => cls.status === 'cancelled').length,
    };

    // Use calendar data hook with empty filters for dashboard
    const { calendarData } = useCalendarData(currentDate, {
        student_id: 'all',
        status: 'all', 
        date_from: '',
        date_to: '',
    });
    
    const { updateClassStatus } = useClassOperations();

    const handleUpdateClassStatus = (classItem: ClassSchedule, status: 'completed' | 'cancelled') => {
        updateClassStatus(classItem, status, () => {
            // Refresh page or handle success - for dashboard, we might just show a success message
            window.location.reload();
        });
    };

    const handleDayClick = (date: Date, dayClasses: ClassSchedule[]) => {
        const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        setSelectedDate(formatDateForModal(dateKey));
        setSelectedDateClasses(dayClasses);
        setDayModalOpen(true);
    };

    const closeDayModal = () => {
        setDayModalOpen(false);
        setSelectedDate('');
        setSelectedDateClasses([]);
    };

    const formatDateForModal = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
                                    <p className="truncate text-lg font-bold sm:text-2xl">{todaysStats.totalClasses}</p>
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
                                    <p className="truncate text-lg font-bold sm:text-2xl">{todaysStats.upcomingClasses}</p>
                                    <p className="text-xs text-gray-600">Upcoming</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        {/* Today's Classes - Takes 2 columns on xl screens */}
                        <div className="xl:col-span-2">
                            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                                <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-[#2563eb]" />
                                        Today's Classes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-96 overflow-y-auto">
                                        <TodaysClasses
                                            todaysClasses={todaysClasses}
                                            onUpdateClassStatus={handleUpdateClassStatus}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Monthly Summary Card */}
                        <div className="xl:col-span-1">
                            <MonthlySummary
                                completedClasses={monthlyCompletedClasses}
                                monthName={currentMonthName || new Date().toLocaleDateString('en-US', { month: 'long' })}
                            />
                        </div>
                    </div>

                    {/* Calendar View */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Calendar</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <CalendarGrid
                                currentDate={currentDate}
                                calendarData={calendarData}
                                onDateChange={setCurrentDate}
                                onDayClick={handleDayClick}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Day Classes Modal */}
            <DayModal
                isOpen={dayModalOpen}
                selectedDate={selectedDate}
                selectedDateClasses={selectedDateClasses}
                onClose={closeDayModal}
                onUpdateClassStatus={handleUpdateClassStatus}
            />
        </AppLayout>
    );
}
