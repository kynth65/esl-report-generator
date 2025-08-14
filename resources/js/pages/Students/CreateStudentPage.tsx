import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateStudentPage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        gender: '',
        notes: '',
        price_amount: '',
        duration_minutes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/students');
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: '/students' },
            { title: 'Add Student', href: '/students/create' }
        ]}>
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <Link href="/students">
                                <Button variant="ghost" size="sm" className="mb-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Students
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Add New Student</h1>
                            <p className="text-gray-600 mt-2 text-base sm:text-lg">Create a new student profile</p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 sm:px-12 py-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid gap-8 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base font-semibold text-gray-700">Student Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter student's full name"
                                            className={`h-12 text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="gender" className="text-base font-semibold text-gray-700">Gender *</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger className={`h-12 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="price_amount" className="text-base font-semibold text-gray-700">Price Amount ($)</Label>
                                        <Input
                                            id="price_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price_amount}
                                            onChange={(e) => setData('price_amount', e.target.value)}
                                            placeholder="Enter price amount (e.g., 5.00)"
                                            className={`h-12 text-base ${errors.price_amount ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.price_amount && (
                                            <p className="text-sm text-red-600 mt-1">{errors.price_amount}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="duration_minutes" className="text-base font-semibold text-gray-700">Duration (minutes)</Label>
                                        <Select value={data.duration_minutes} onValueChange={(value) => setData('duration_minutes', value)}>
                                            <SelectTrigger className={`h-12 ${errors.duration_minutes ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="25">25 minutes</SelectItem>
                                                <SelectItem value="50">50 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.duration_minutes && (
                                            <p className="text-sm text-red-600 mt-1">{errors.duration_minutes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing preview */}
                                {data.price_amount && data.duration_minutes && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Rate:</strong> ${(parseFloat(data.price_amount) / parseFloat(data.duration_minutes)).toFixed(4)} per minute
                                            {' • '}
                                            <strong>Example:</strong> A 50-minute class would cost ${((parseFloat(data.price_amount) / parseFloat(data.duration_minutes)) * 50).toFixed(2)}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label htmlFor="notes" className="text-base font-semibold text-gray-700">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Additional notes about the student (optional)"
                                        rows={6}
                                        className={`resize-none text-base ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 h-12 text-base font-semibold"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        {processing ? 'Creating...' : 'Create Student'}
                                    </Button>
                                    <Link href="/students" className="flex-1 sm:flex-none">
                                        <Button type="button" variant="outline" className="w-full h-12 text-base">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}