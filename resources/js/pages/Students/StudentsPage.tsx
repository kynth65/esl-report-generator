import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    gender: 'male' | 'female' | 'other';
    notes?: string;
    classes_count: number;
    upcoming_classes_count: number;
    created_at: string;
}

interface StudentsPageProps {
    students: Student[];
}

export default function StudentsPage({ students }: StudentsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDelete = (studentId: number) => {
        if (confirm('Are you sure you want to delete this student? This will also delete all their scheduled classes.')) {
            router.delete(`/students/${studentId}`);
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <Head title="Students - SUMMAFLOW" />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-6 space-y-3 text-center sm:mb-8 sm:space-y-4">
                    <div className="space-y-2">
                        <h1 className="bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text px-2 text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
                            SUMMAFLOW
                        </h1>
                        <p className="mx-auto max-w-3xl px-4 text-sm font-medium text-[#2563eb] sm:text-base md:text-lg">Student Management</p>
                    </div>
                    <p className="mx-auto max-w-2xl px-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
                        Manage your ESL students and track their progress with comprehensive profiles and class statistics.
                    </p>
                </div>

                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Students</h2>
                            <p className="mt-2 text-base text-gray-600 sm:text-lg">Manage your ESL students</p>
                        </div>
                        <Link href="/students/create" className="w-full sm:w-auto">
                            <Button className="h-11 w-full bg-[#2563eb] px-6 font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl sm:w-auto">
                                <Plus className="mr-2 h-5 w-5" />
                                Add Student
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Stats */}
                    <div className="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <div className="relative w-full max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search students..."
                                className="h-11 border-gray-200 pl-12 text-base shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Card className="p-3 transition-shadow hover:shadow-md sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold sm:text-xl">{filteredStudents.length}</p>
                                    <p className="text-xs text-gray-600">{filteredStudents.length === 1 ? 'Student' : 'Students'}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Students Grid */}
                    {filteredStudents.length === 0 ? (
                        <Card className="mx-auto max-w-4xl border-0 py-16 text-center shadow-lg">
                            <CardContent>
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900">No students found</h3>
                                <p className="mb-8 text-base leading-relaxed text-gray-600">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
                                </p>
                                {!searchTerm && (
                                    <Link href="/students/create">
                                        <Button className="h-11 bg-[#2563eb] px-6 font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Add Student
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredStudents.map((student) => (
                                <Card
                                    key={student.id}
                                    className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="truncate text-lg font-semibold text-gray-900">{student.name}</CardTitle>
                                                <Badge className={`mt-2 text-xs ${getGenderBadge(student.gender)}`}>{student.gender}</Badge>
                                            </div>
                                            <div className="ml-2 flex gap-1">
                                                <Link href={`/students/${student.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/students/${student.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(student.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-0">
                                        {student.notes && <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{student.notes}</p>}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{student.classes_count} total</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs font-medium">
                                                {student.upcoming_classes_count} upcoming
                                            </Badge>
                                        </div>
                                        <div className="border-t border-gray-100 pt-2 text-xs text-gray-400">Added {student.created_at}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
