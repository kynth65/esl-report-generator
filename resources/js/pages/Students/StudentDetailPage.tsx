import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Plus, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
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
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[gender as keyof typeof colors] || colors.other;
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            upcoming: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status as keyof typeof colors] || colors.upcoming;
    };

    const upcomingClasses = student.classes.filter(c => c.status === 'upcoming');
    const completedClasses = student.classes.filter(c => c.status === 'completed');
    const cancelledClasses = student.classes.filter(c => c.status === 'cancelled');
    
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
        <AppLayout breadcrumbs={[
            { title: 'Students', href: '/students' },
            { title: student.name, href: `/students/${student.id}` }
        ]}>
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <Link href="/students">
                                <Button variant="ghost" size="sm" className="mb-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Students
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{student.name}</h1>
                            <Badge className={`text-sm mt-3 ${getGenderBadge(student.gender)}`}>
                                {student.gender}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <Link href={`/schedules/create?student_id=${student.id}`}>
                                <Button variant="outline" className="w-full sm:w-auto h-10">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Class
                                </Button>
                            </Link>
                            <Link href={`/students/${student.id}/edit`}>
                                <Button variant="outline" className="w-full sm:w-auto h-10">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto h-10"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
                        <Card className="lg:col-span-2 shadow-md border-0">
                            <CardHeader className="text-center lg:text-left">
                                <CardTitle className="text-xl text-gray-900">Student Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 px-8 py-6">
                                {/* Pricing Information */}
                                {student.price_amount && student.duration_minutes && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Pricing Information</h3>
                                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-medium">Price Amount:</span>
                                                <span className="text-gray-900 font-semibold">${Number(student.price_amount).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-medium">Duration:</span>
                                                <span className="text-gray-900 font-semibold">{student.duration_minutes} minutes</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-blue-300 pt-3">
                                                <span className="text-blue-800 font-medium">Rate per minute:</span>
                                                <span className="text-blue-900 font-bold">${(Number(student.price_amount) / Number(student.duration_minutes)).toFixed(4)}</span>
                                            </div>
                                            <div className="text-sm text-blue-700 mt-4 p-3 bg-blue-100 rounded border border-blue-200">
                                                <strong>Examples:</strong><br/>
                                                • 25-minute class: ${((Number(student.price_amount) / Number(student.duration_minutes)) * 25).toFixed(2)}<br/>
                                                • 50-minute class: ${((Number(student.price_amount) / Number(student.duration_minutes)) * 50).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Notes</h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-lg text-base">
                                        {student.notes || 'No notes available'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Student since</h3>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg inline-block text-base">{student.created_at}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md border-0">
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-gray-900">Class Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-6 py-6">
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700 font-medium text-base">Total Classes</span>
                                    <Badge variant="outline" className="px-4 py-2 text-sm">{student.classes.length}</Badge>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700 font-medium text-base">Upcoming</span>
                                    <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">{upcomingClasses.length}</Badge>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700 font-medium text-base">Completed</span>
                                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">{completedClasses.length}</Badge>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700 font-medium text-base">Cancelled</span>
                                    <Badge className="bg-red-100 text-red-800 px-4 py-2 text-sm">{cancelledClasses.length}</Badge>
                                </div>
                                
                                {/* Earnings Information */}
                                {student.price_amount && student.duration_minutes && (
                                    <>
                                        <div className="border-t border-gray-200 my-4"></div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-gray-700 font-medium text-base">Total Earnings</span>
                                            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-bold">
                                                ${(student.total_earnings || 0).toFixed(2)}
                                            </Badge>
                                        </div>
                                        {student.current_month_name && (
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-gray-700 font-medium text-base">{student.current_month_name}</span>
                                                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-bold">
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
                    <Card className="shadow-md border-0 max-w-7xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl text-gray-900">Classes History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {student.classes.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No classes scheduled</h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                        This student doesn't have any classes scheduled yet.
                                    </p>
                                    <Link href={`/schedules/create?student_id=${student.id}`}>
                                        <Button className="h-11 px-6">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Schedule First Class
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {student.classes.map((classItem) => (
                                        <div key={classItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-5 w-5" />
                                                    <span className="font-medium">{classItem.class_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="h-5 w-5" />
                                                    <span>{classItem.start_time} ({classItem.duration_hours})</span>
                                                </div>
                                                {classItem.price && classItem.price > 0 && (
                                                    <div className="text-sm font-semibold text-green-600">
                                                        ${classItem.price.toFixed(2)}
                                                    </div>
                                                )}
                                                <Badge className={`text-sm ${getStatusBadge(classItem.status)}`}>
                                                    {classItem.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Link href={`/schedules/${classItem.id}/edit`} className="flex-1 sm:flex-none">
                                                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                                                        <Edit className="h-4 w-4 mr-2" />
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
                        <Card className="shadow-md border-0 max-w-7xl mx-auto">
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-gray-900 flex items-center justify-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Weekly Earnings
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
                                            <h4 className="font-semibold text-gray-900 text-lg mb-4">Classes This Week</h4>
                                            {currentWeek.classes.map((classItem) => (
                                                <div key={classItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
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
                                                                <Edit className="h-4 w-4 mr-2" />
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
            </div>
        </AppLayout>
    );
}