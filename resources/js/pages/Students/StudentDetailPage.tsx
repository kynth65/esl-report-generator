import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ClassSchedule {
    id: number;
    class_date: string;
    start_time: string;
    duration_minutes: number;
    duration_hours: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    notes?: string;
    price?: number;
}

interface WeeklyEarning {
    week_start: string;
    week_end: string;
    week_label: string;
    total_earnings: number;
    classes: ClassSchedule[];
}

interface Student {
    id: number;
    name: string;
    gender: 'male' | 'female' | 'other';
    notes?: string;
    price_amount?: number;
    duration_minutes?: number;
    created_at: string;
    total_earnings?: number;
    this_month_earnings?: number;
    current_month_name?: string;
    weekly_earnings?: WeeklyEarning[];
    classes: ClassSchedule[];
}

interface StudentDetailPageProps {
    student: Student;
}

export default function StudentDetailPage({ student }: StudentDetailPageProps) {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this student? This will also delete all their scheduled classes.')) {
            router.delete(`/students/${student.id}`);
        }
    };

    const getGenderBadge = (gender: string) => {
        const colors = {
            male: 'bg-blue-100 text-blue-800',
            female: 'bg-pink-100 text-pink-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[gender as keyof typeof colors] || colors.other;
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            upcoming: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || colors.upcoming;
    };

    const upcomingClasses = student.classes.filter((c) => c.status === 'upcoming');
    const completedClasses = student.classes.filter((c) => c.status === 'completed');
    const cancelledClasses = student.classes.filter((c) => c.status === 'cancelled');

    const weeklyEarnings = student.weekly_earnings || [];
    const currentWeek = weeklyEarnings[currentWeekIndex];

    const navigateWeek = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
        } else if (direction === 'next' && currentWeekIndex < weeklyEarnings.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Students', href: '/students' },
                { title: student.name, href: `/students/${student.id}` },
            ]}
        >
            <Head title={`${student.name}`} />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">{student.name}</h2>
                            <div className="mt-2 flex justify-center sm:justify-start">
                                <Badge className={`text-sm ${getGenderBadge(student.gender)}`}>{student.gender}</Badge>
                            </div>
                        </div>
                        <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
                            <Link href="/students" className="flex-1 sm:flex-none">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-gray-300 px-3 text-xs font-medium transition-colors hover:bg-gray-50 hover:text-gray-900 sm:px-6 sm:text-sm"
                                >
                                    <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Back to Students</span>
                                    <span className="sm:hidden">Back</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href={`/schedules/create?student_id=${student.id}`}>
                            <Button className="h-10 w-full bg-[#2563eb] px-4 text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Schedule Class
                            </Button>
                        </Link>
                        <Link href={`/students/${student.id}/edit`}>
                            <Button variant="outline" className="h-10 w-full transition-colors hover:bg-gray-50 sm:w-auto">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="h-10 w-full border-red-200 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 sm:w-auto"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>

                    {/* Student Information */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl lg:col-span-2">
                            <CardHeader className="text-center lg:text-left">
                                <CardTitle className="text-xl text-gray-900">Student Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 px-8 py-6">
                                {/* Pricing Information */}
                                {student.price_amount && student.duration_minutes && (
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Pricing Information</h3>
                                        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-6">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-700">Price Amount:</span>
                                                <span className="font-semibold text-gray-900">${Number(student.price_amount).toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-700">Duration:</span>
                                                <span className="font-semibold text-gray-900">{student.duration_minutes} minutes</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-blue-300 pt-3">
                                                <span className="font-medium text-blue-800">Rate per minute:</span>
                                                <span className="font-bold text-blue-900">
                                                    ${(Number(student.price_amount) / Number(student.duration_minutes)).toFixed(4)}
                                                </span>
                                            </div>
                                            <div className="mt-4 rounded border border-blue-200 bg-blue-100 p-3 text-sm text-blue-700">
                                                <strong>Examples:</strong>
                                                <br />• 25-minute class: $
                                                {((Number(student.price_amount) / Number(student.duration_minutes)) * 25).toFixed(2)}
                                                <br />• 50-minute class: $
                                                {((Number(student.price_amount) / Number(student.duration_minutes)) * 50).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Notes</h3>
                                    <p className="rounded-lg bg-gray-50 p-6 text-base leading-relaxed text-gray-600">
                                        {student.notes || 'No notes available'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Student since</h3>
                                    <p className="inline-block rounded-lg bg-gray-50 p-4 text-base text-gray-600">{student.created_at}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-gray-900">Class Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-6 py-6">
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-base font-medium text-gray-700">Total Classes</span>
                                    <Badge variant="outline" className="px-4 py-2 text-sm">
                                        {student.classes.length}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-base font-medium text-gray-700">Upcoming</span>
                                    <Badge className="bg-green-100 px-4 py-2 text-sm text-green-800">{upcomingClasses.length}</Badge>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-base font-medium text-gray-700">Completed</span>
                                    <Badge className="bg-blue-100 px-4 py-2 text-sm text-blue-800">{completedClasses.length}</Badge>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-base font-medium text-gray-700">Cancelled</span>
                                    <Badge className="bg-red-100 px-4 py-2 text-sm text-red-800">{cancelledClasses.length}</Badge>
                                </div>

                                {/* Earnings Information */}
                                {student.price_amount && student.duration_minutes && (
                                    <>
                                        <div className="my-4 border-t border-gray-200"></div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-base font-medium text-gray-700">Total Earnings</span>
                                            <Badge className="bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                                                ${(student.total_earnings || 0).toFixed(2)}
                                            </Badge>
                                        </div>
                                        {student.current_month_name && (
                                            <div className="flex items-center justify-between py-3">
                                                <span className="text-base font-medium text-gray-700">{student.current_month_name}</span>
                                                <Badge className="bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                                                    ${(student.this_month_earnings || 0).toFixed(2)}
                                                </Badge>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Classes History */}
                    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl text-gray-900">Classes History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {student.classes.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Calendar className="mx-auto mb-6 h-16 w-16 text-gray-400" />
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">No classes scheduled</h3>
                                    <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-600">
                                        This student doesn't have any classes scheduled yet.
                                    </p>
                                    <Link href={`/schedules/create?student_id=${student.id}`}>
                                        <Button className="h-11 bg-[#2563eb] px-6 text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Schedule First Class
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {student.classes.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="flex flex-col items-start justify-between rounded-lg border border-gray-200 p-8 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 sm:flex-row sm:items-center"
                                        >
                                            <div className="mb-4 flex w-full flex-col items-start gap-4 sm:mb-0 sm:w-auto sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-5 w-5" />
                                                    <span className="font-medium">{classItem.class_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="h-5 w-5" />
                                                    <span>
                                                        {classItem.start_time} ({classItem.duration_hours})
                                                    </span>
                                                </div>
                                                {classItem.price && classItem.price > 0 && (
                                                    <div className="text-sm font-semibold text-green-600">${classItem.price.toFixed(2)}</div>
                                                )}
                                                <Badge className={`text-sm ${getStatusBadge(classItem.status)}`}>{classItem.status}</Badge>
                                            </div>
                                            <div className="flex w-full gap-2 sm:w-auto">
                                                <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weekly Earnings */}
                    {student.price_amount && student.duration_minutes && weeklyEarnings.length > 0 && (
                        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2 text-xl text-gray-900">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Weekly Earnings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Week Navigation */}
                                <div className="mb-6 flex items-center justify-between">
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
                                        <h3 className="text-lg font-semibold text-gray-900">{currentWeek ? currentWeek.week_label : 'No data'}</h3>
                                        <p className="text-sm text-gray-600">
                                            Week {currentWeekIndex + 1} of {weeklyEarnings.length}
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
                                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-medium text-green-800">Total Earnings This Week:</span>
                                                <span className="text-2xl font-bold text-green-900">${currentWeek.total_earnings.toFixed(2)}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-green-700">
                                                {currentWeek.classes.length} {currentWeek.classes.length === 1 ? 'class' : 'classes'} completed
                                            </p>
                                        </div>

                                        {/* Classes in this week */}
                                        <div className="space-y-3">
                                            <h4 className="mb-4 text-lg font-semibold text-gray-900">Classes This Week</h4>
                                            {currentWeek.classes.map((classItem) => (
                                                <div
                                                    key={classItem.id}
                                                    className="flex flex-col items-start justify-between rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 sm:flex-row sm:items-center"
                                                >
                                                    <div className="mb-4 flex w-full flex-col items-start gap-4 sm:mb-0 sm:w-auto sm:flex-row sm:items-center">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="font-medium">{classItem.class_date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Clock className="h-4 w-4" />
                                                            <span>
                                                                {classItem.start_time} ({classItem.duration_hours})
                                                            </span>
                                                        </div>
                                                        {classItem.price && classItem.price > 0 && (
                                                            <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                                                                ${classItem.price.toFixed(2)}
                                                            </div>
                                                        )}
                                                        <Badge className="border-blue-200 bg-blue-100 text-sm text-blue-800">completed</Badge>
                                                    </div>
                                                    <div className="flex w-full gap-2 sm:w-auto">
                                                        <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                                                                <Edit className="mr-2 h-4 w-4" />
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
                                <div className="mt-8 rounded-lg bg-gray-50 p-4">
                                    <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">{weeklyEarnings.length}</div>
                                            <div className="text-sm text-gray-600">{weeklyEarnings.length === 1 ? 'Week' : 'Weeks'} with Classes</div>
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
            </div>
        </AppLayout>
    );
}
