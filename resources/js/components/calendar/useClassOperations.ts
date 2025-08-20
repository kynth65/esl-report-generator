import { router } from '@inertiajs/react';
import { useState } from 'react';

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

export function useClassOperations() {
    const [loading, setLoading] = useState(false);
    
    const updateClassStatus = (
        classItem: ClassSchedule, 
        status: 'completed' | 'cancelled',
        onSuccess?: () => void
    ) => {
        setLoading(true);
        
        // Ensure start_time is in H:i format (remove seconds if present)
        const formattedStartTime = classItem.start_time.includes(':') 
            ? classItem.start_time.split(':').slice(0, 2).join(':') 
            : classItem.start_time;

        router.patch(
            `/schedules/${classItem.id}`,
            {
                student_id: classItem.student.id,
                class_date: classItem.class_date,
                start_time: formattedStartTime,
                duration_minutes: classItem.duration_minutes,
                status: status,
                notes: classItem.notes || '',
            },
            {
                onSuccess: () => {
                    setLoading(false);
                    onSuccess?.();
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    };

    const deleteClass = (
        classId: number,
        onSuccess?: () => void
    ) => {
        setLoading(true);
        
        router.delete(`/schedules/${classId}`, {
            onSuccess: () => {
                setLoading(false);
                onSuccess?.();
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return {
        updateClassStatus,
        deleteClass,
        loading,
    };
}