import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import '../../css/calendar.css'
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
const Dashboard = () => {
    // State Management
    const axiosSecure = useAxiosSecure();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user, loading } = useAuth();

    // Fake Backend API Base URL

    const { data: { data: { classes = [], tasks = [] } = {} } = {}, isLoading } = useQuery({
        queryKey: ['dashboardData', "calendar-events", currentDate.getFullYear(), currentDate.getMonth()],
        queryFn: async () => {
            const result = await axiosSecure.get(`/dashboard?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`);
            // console.log(result)
            return result.data;
        },
        enabled: !!user && !loading
    });

    const classEvents = classes.map(cls => ({
        id: cls._id,
        title: cls.subject,
        start: cls.startTime,
        end: cls.endTime,
        color: "#2563eb",
        extendedProps: {
            type: "class"
        }
    }));

    const taskEvents = tasks.map(task => ({
        id: task._id,
        title: task.subject,
        start: task.startTime,
        end: task.endTIme,
        color: "#16a34a",
        extendedProps: {
            type: "task"
        }
    }));

    const events = [...classEvents, ...taskEvents];

    // console.log(isLoading, classes, tasks);

    if (isLoading) {
        return <LoadingSpinner />
    }
    // if (!user || loading) {
    //     return <LoadingSpinner />
    // }

    return (
        <div className="min-h-screen">
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ]}
                initialView="dayGridMonth"
                events={events}
                // contentHeight="auto"
                contentHeight="auto"
                initialDate={currentDate}

                datesSet={(info) => {
                    setCurrentDate(info.view.currentStart);
                }}
            />
        </div>
    );

};

export default Dashboard;