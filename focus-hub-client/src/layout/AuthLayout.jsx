import React from 'react';
import { Link, Outlet } from 'react-router';
import SignIn from '../pages/SignIn/SignIn';
import DesktopNavbar from '../components/navbar/DesktopNavbar';
import useTheme from '../hooks/useTheme';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
    const { toggleTheme, theme } = useTheme();

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <ToastContainer />
            <header className="w-full px-4 py-3 border-b border-base-200 bg-base-100">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary text-base-100 flex items-center justify-center font-bold">
                            FH
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold text-neutral-900 dark:text-white">Focus Hub</div>
                            <div className="text-xs text-neutral-700 dark:text-accent">Home</div>
                        </div>
                    </Link>

                    {/* <nav className="hidden sm:flex items-center gap-4">
                        <Link to="/" className="text-sm text-neutral-700 dark:text-accent">
                            Home
                        </Link>
                    </nav> */}
                    <div className="flex items-center justify-between">
                        {/* <span className="font-medium">
                                {theme === "light" ? "Light Mode" : "Dark Mode"}
                            </span> */}

                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={theme === "dark"}
                            onChange={toggleTheme}
                        />
                    </div>
                </div>
            </header>
            {/* <DesktopNavbar /> */}
            {/* <div> */}

            {/* <h2 className="text-3xl">Opps!! You cant go forward without Signing In</h2> */}

            {/* Main content */}
            {/* <div className="flex-1 flex flex-col items-center justify-center p-6"> */}

            <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-10">
                <div className=''>
                    <h2 className="text-3xl text-center text-secondary dark:text-accent"><b className='text-red-600'>Ops!!</b> You can not go forward without logging in</h2>
                </div>
                <div className="w-full max-w-md">
                    <Outlet />
                    {/* small footer note */}
                    <div className="mt-4 text-center text-xs text-neutral-500">
                        By signing in you agree to our <Link to="/terms" className="underline">Terms</Link>.
                    </div>
                </div>
            </main>
            {/* </div> */}
            {/* </div> */}
        </div>
    );
};

export default AuthLayout;