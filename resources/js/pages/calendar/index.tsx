import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CalendarGrid,
    TodaysClasses,
    ClassFilters,
    ClassesListView,
    MonthlySummary,
    WeeklyEarnings,
    ViewToggle,
    DayModal,
    useCalendarData,
    useClassOperations,
} from '@/components/calendar';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { CalendarDays, Filter, Plus } from 'lucide-react';
import { useState } from 'react';

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
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [dayModalOpen, setDayModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDateClasses, setSelectedDateClasses] = useState<ClassSchedule[]>([]);

    const { data, setData, get, processing } = useForm({
        student_id: filters.student_id || 'all',
        status: filters.status || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: '',
    });

    // Use custom hooks
    const { calendarData, currentMonthCompleted: monthCompleted, currentMonthDisplayName, refetch } = useCalendarData(currentDate, data);
    const { updateClassStatus, loading: operationLoading } = useClassOperations();

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
        router.get('/calendar', {}, { preserveState: true });
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

    const handleUpdateClassStatus = (classItem: ClassSchedule, status: 'completed' | 'cancelled') => {
        updateClassStatus(classItem, status, () => {
            refetch(); // Refresh calendar data
        });
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

    const navigateWeek = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
        } else if (direction === 'next' && currentWeekIndex < weeklyEarnings.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
        }
    };

    // Determine the displayed month completed count and name
    const displayCompleted = monthCompleted !== null ? monthCompleted : monthlyCompletedClasses;
    const displayMonthName = currentMonthDisplayName || currentMonthName;

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

                    {/* Filters and Completed Classes */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        {/* Filters - 3/4 width */}
                        <div className="lg:col-span-3">
                            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                                <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Filter className="h-5 w-5 text-[#2563eb]" />
                                        Filter Classes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ClassFilters
                                        students={students}
                                        filterData={data}
                                        onFilterChange={(key, value) => setData(key, value)}
                                        onApplyFilters={handleFilter}
                                        onClearFilters={clearFilters}
                                        isProcessing={processing}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Monthly Summary - 1/4 width */}
                        <div className="lg:col-span-1">
                            <MonthlySummary
                                completedClasses={displayCompleted}
                                monthName={displayMonthName}
                            />
                        </div>
                    </div>

                    {/* Today's Classes */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r to-white">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-[#2563eb]" />
                                Today's Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TodaysClasses
                                todaysClasses={todaysClasses}
                                onUpdateClassStatus={handleUpdateClassStatus}
                            />
                        </CardContent>
                    </Card>

                    {/* Calendar/List View */}
                    <ViewToggle view={view} onViewChange={setView}>
                        {view === 'month' ? (
                            <CalendarGrid
                                currentDate={currentDate}
                                calendarData={calendarData}
                                onDateChange={setCurrentDate}
                                onDayClick={handleDayClick}
                            />
                        ) : (
                            <ClassesListView
                                classes={classes.data}
                                onUpdateClassStatus={handleUpdateClassStatus}
                            />
                        )}
                    </ViewToggle>

                    {/* Weekly Earnings */}
                    {weeklyEarnings.length > 0 && (
                        <WeeklyEarnings
                            weeklyEarnings={weeklyEarnings}
                            currentWeekIndex={currentWeekIndex}
                            onNavigateWeek={navigateWeek}
                            isFiltered={data.student_id !== 'all'}
                        />
                    )}
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