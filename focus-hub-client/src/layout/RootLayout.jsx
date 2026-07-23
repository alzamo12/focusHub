// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import DesktopNavbar from "../components/navbar/DesktopNavbar";
import DesktopSidebar from "../components/sidebar/DesktopSidebar";
import useAuth from "../hooks/useAuth";
import { ToastContainer } from 'react-toastify';


const RootLayout = () => {
    // mobile drawer open state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { logout } = useAuth();
    // live date/time
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // ===== nav links as JSX fragment (reuse in sidebar UL) =====
    const navLinks = (
        <>
            <li className="">
                <Link to="/dashboard" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Dashboard
                </Link>
            </li>
            <li>
                <Link to="/dashboard/class-schedule-tracker" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Schedule
                </Link>
            </li>
            <li>
                <Link to="/dashboard/budget" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Budget
                </Link>
            </li>
            <li>
                <Link to="/dashboard/notes" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Notes
                </Link>
            </li>
            <li>
                <Link to="/dashboard/tasks" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Tasks
                </Link>
            </li>
            <li>
                <Link to="/dashboard/generate-questions" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Generate Questions
                </Link>
            </li>
            {/* <li>
                <Link to="/settings" className="rounded-md px-4 py-1 hover:bg-secondary/30">
                    Settings
                </Link>
            </li> */}
        </>
    );

    return (
        <div className="flex min-h-screen text-neutral-900">
            <ToastContainer />
            {/* sidebar */}
            <DesktopSidebar setDrawerOpen={setDrawerOpen}
                drawerOpen={drawerOpen}
                logout={logout}
                navLinks={navLinks}
            />
            {/* proper outlet + navbar*/}
            <div className="flex-1 flex flex-col ">
                {/* navbar */}
                <header className="sticky top-0 z-40 w-full border-b border-primary dark:border-primary">
                    <DesktopNavbar
                        setDrawerOpen={setDrawerOpen}
                        timeString={timeString}
                        dateString={dateString} />
                </header>
                {/* Outlet area (content) */}
                <main className="flex-1 overflow-auto p-2 md:pt-5 w-11/12 2xl:w-4/5  mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default RootLayout
