import { useEffect, useState } from 'react';

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

interface FilterData {
    student_id: string;
    status: string;
    date_from: string;
    date_to: string;
}

interface CalendarDataResponse {
    classes?: { [key: string]: ClassSchedule[] };
    completedCount?: number;
    monthName?: string;
}

export function useCalendarData(currentDate: Date, filterData: FilterData) {
    const [calendarData, setCalendarData] = useState<{ [key: string]: ClassSchedule[] }>({});
    const [currentMonthCompleted, setCurrentMonthCompleted] = useState(0);
    const [currentMonthDisplayName, setCurrentMonthDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCalendarData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
            const params = new URLSearchParams({
                month: monthKey,
                ...(filterData.student_id !== 'all' && { student_id: filterData.student_id }),
                ...(filterData.status !== 'all' && { status: filterData.status }),
                ...(filterData.date_from && { date_from: filterData.date_from }),
                ...(filterData.date_to && { date_to: filterData.date_to }),
            });

            const response = await fetch(`/calendar/data?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch calendar data');
            }
            
            const data: CalendarDataResponse = await response.json();
            
            setCalendarData(data.classes || {});
            if (data.completedCount !== undefined) {
                setCurrentMonthCompleted(data.completedCount);
            }
            if (data.monthName) {
                setCurrentMonthDisplayName(data.monthName);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, [currentDate, filterData.student_id, filterData.status, filterData.date_from, filterData.date_to]);

    return {
        calendarData,
        currentMonthCompleted,
        currentMonthDisplayName,
        loading,
        error,
        refetch: fetchCalendarData,
    };
}