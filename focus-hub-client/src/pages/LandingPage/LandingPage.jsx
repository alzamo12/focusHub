import React from 'react';
import Hero from '../../components/landingPage/Hero';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import { Navigate } from 'react-router';
const LandingPage = () => {
    const {user, loading} = useAuth();
    if(loading) return <LoadingSpinner/>
    if(user) return <Navigate to="/dashboard" replace/>
    return (
        <div>
            <Hero />
        </div>
    );
};

export default LandingPage;