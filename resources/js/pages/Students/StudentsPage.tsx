import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Users, Calendar, Edit, Trash2, Eye } from 'lucide-react';

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

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (studentId: number) => {
        if (confirm('Are you sure you want to delete this student? This will also delete all their scheduled classes.')) {
            router.delete(`/students/${studentId}`);
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

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Students</h1>
                            <p className="text-gray-600 mt-2 text-base sm:text-lg">Manage your ESL students</p>
                        </div>
                        <Link href="/students/create" className="w-full sm:w-auto">
                            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-11 px-6">
                                <Plus className="h-5 w-5 mr-2" />
                                Add Student
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Stats */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-center sm:justify-between">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search students..."
                                className="pl-12 h-11 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-base text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">{filteredStudents.length} students</span>
                        </div>
                    </div>

                    {/* Students Grid */}
                    {filteredStudents.length === 0 ? (
                        <Card className="text-center py-16 shadow-sm max-w-4xl mx-auto">
                            <CardContent>
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">No students found</h3>
                                <p className="text-gray-600 mb-8 text-base">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
                                </p>
                                {!searchTerm && (
                                    <Link href="/students/create">
                                        <Button className="h-11 px-6">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Student
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredStudents.map((student) => (
                                <Card key={student.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                    {student.name}
                                                </CardTitle>
                                                <Badge className={`text-xs mt-2 ${getGenderBadge(student.gender)}`}>
                                                    {student.gender}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1 ml-2">
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
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        {student.notes && (
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {student.notes}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{student.classes_count} total</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs font-medium">
                                                {student.upcoming_classes_count} upcoming
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                                            Added {student.created_at}
                                        </div>
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