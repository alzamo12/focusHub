import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const TodayClasses = () => {

    const axiosSecure = useAxiosSecure();
    // const { data: todayClasses } = useQuery({
    //     queryKey: ["todayClasses", "class"],
    //     queryFn: async () => {
    //         const response = await axiosSecure.get('/classes/today');
    //         return response.data;
    //     }
    // });
    // console.log(todayClasses)

    return (
        <div>

        </div>
    );
};

export default TodayClasses;