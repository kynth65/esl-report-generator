import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Plus } from 'lucide-react';

interface ClassSchedule {
    id: number;
    class_date: string;
    start_time: string;
    duration_minutes: number;
    duration_hours: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    notes?: string;
}

interface Student {
    id: number;
    name: string;
    gender: 'male' | 'female' | 'other';
    notes?: string;
    created_at: string;
    classes: ClassSchedule[];
}

interface StudentDetailPageProps {
    student: Student;
}

export default function StudentDetailPage({ student }: StudentDetailPageProps) {
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
                </div>
            </div>
        </AppLayout>
    );
}