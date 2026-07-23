import React, { Suspense } from 'react';
import useTittle from '../../hooks/useTittle';
import Dashboard from '../../features/Dashboard/Dashboard';
import useAuth from '../../hooks/useAuth';
import TodayTasks from '../../features/Dashboard/TodayTasks';
import TodayClasses from '../../features/Dashboard/TodayClasses';
const Home = () => {
    const { user: { displayName } } = useAuth();
    useTittle("Home")

    return (
        <div className='min-h-screen'>
            <div className="my-8">
                <h1 className="text-3xl font-bold text-secondary dark:text-primary">Good Morning, {displayName} 👋</h1>
                <p className="text-base-content/70">Monday, May 18, 2026</p>
            </div>
            <Dashboard />
        </div>
    );
};

export default Home;