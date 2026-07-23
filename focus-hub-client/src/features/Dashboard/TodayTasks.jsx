import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const TodayTasks = () => {
    const axiosSecure = useAxiosSecure();
    // const { data: todayTasks } = useQuery({
    //     queryKey: ["todayTasks", "task"],
    //     queryFn: async () => {
    //         const response = await axiosSecure.get('/tasks/today');
    //         return response.data;
    //     }
    // });
    // console.log(todayTasks)
    return (
        <div>

        </div>
    );
};

export default TodayTasks;