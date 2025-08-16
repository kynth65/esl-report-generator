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
            <Head title="Students" />
            <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
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
                    <div className="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
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

                    {/* Students Table */}
                    <Card className="border-0 bg-gradient-to-br from-white to-white shadow-lg">
                        <CardHeader className="rounded-t-lg bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#2563eb]" />
                                Students List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredStudents.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">No students found</h3>
                                    <p className="mb-6 text-sm text-gray-600">
                                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
                                    </p>
                                    {!searchTerm && (
                                        <Link href="/students/create">
                                            <Button className="h-11 bg-[#2563eb] text-white shadow-lg transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-xl">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Student
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    {/* Desktop Table View - Hidden on small screens */}
                                    <div className="hidden md:block">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Student
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Gender
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Classes
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Notes
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Added
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 uppercase sm:px-6 sm:py-4">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {filteredStudents.map((student) => (
                                                    <tr key={student.id} className="transition-colors hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                            <div className="flex items-center">
                                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
                                                                    <Users className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                                                                </div>
                                                                <div className="ml-3 sm:ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 sm:text-base">
                                                                        {student.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                            <Badge className={`text-xs ${getGenderBadge(student.gender)}`}>{student.gender}</Badge>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>{student.classes_count} total</span>
                                                                </div>
                                                                <Badge variant="outline" className="w-fit text-xs">
                                                                    {student.upcoming_classes_count} upcoming
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 sm:px-6">
                                                            <div className="max-w-xs truncate text-sm text-gray-600">
                                                                {student.notes || 'No notes'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600 sm:px-6">
                                                            {student.created_at}
                                                        </td>
                                                        <td className="px-4 py-4 text-right whitespace-nowrap sm:px-6">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link href={`/students/${student.id}`}>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Link href={`/students/${student.id}/edit`}>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(student.id)}
                                                                    className="h-8 w-8 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View - Shown on small screens */}
                                    <div className="space-y-3 p-3 md:hidden">
                                        {filteredStudents.map((student) => (
                                            <div
                                                key={student.id}
                                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                                            >
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                                <Users className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                                <Badge className={`mt-1 text-xs ${getGenderBadge(student.gender)}`}>
                                                                    {student.gender}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
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

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{student.classes_count} total</span>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {student.upcoming_classes_count} upcoming
                                                        </Badge>
                                                    </div>

                                                    {student.notes && (
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Notes: </span>
                                                            <span className="line-clamp-2">{student.notes}</span>
                                                        </div>
                                                    )}

                                                    <div className="border-t border-gray-100 pt-2 text-xs text-gray-400">
                                                        Added {student.created_at}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
