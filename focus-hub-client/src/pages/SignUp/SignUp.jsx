// src/pages/SignUp.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "../../components/SocialLogin/GoogleLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useTittle from "../../hooks/useTittle";
import { toast } from "react-toastify";

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { createUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    useTittle("Sign Up")
    function onSubmit(data) {
        // Design-only: do nothing
        // console.log(data);
        const { email, name, password, photo } = data;
        createUser(email, password)
            .then(async () => {
                updateUser(name, photo)
                // console.log(result)
                const res = await axiosPublic.post('/users', data);
                // console.log(res?.data)
                navigate("/dashboard")
            })
            .catch(err => {
                console.log(err)
                toast.error(err.message || 'Please try again later')
                // todo: show an error msg to the user
            })
    }

    return (
        <div className="card bg-base-100 dark:border dark:border-primary shadow-lg rounded-2xl p-6">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">Sign Up</h1>
            <p className="text-sm text-neutral-700 dark:text-accent mb-6">Create a new account for Focus Hub</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-neutral-800 dark:text-accent block mb-2">
                        Full Name
                    </label>
                    <input
                        id="name"
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Your Name"
                        className="input input-bordered input-style w-full rounded-lg bg-white"
                    />
                    {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-neutral-800 dark:text-accent block mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="you@example.com"
                        className="input input-bordered input-style w-full rounded-lg bg-white"
                    />
                    {errors.email && <span className="text-xs text-red-500">Email is required</span>}
                </div>

                {/* Photo URL */}
                <div>
                    <label htmlFor="photo" className="text-sm font-medium text-neutral-800 dark:text-accent block mb-2">
                        Photo URL
                    </label>
                    <input
                        id="photo"
                        {...register("photo")}
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        className="input input-bordered input-style w-full rounded-lg bg-white"
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-neutral-800 dark:text-accent block mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            {...register("password", { required: true })}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="input input-bordered input-style w-full rounded-lg pr-12 bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm h-8 w-10 p-0 rounded"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {errors.password && <span className="text-xs text-red-500">Password is required</span>}
                </div>

                {/* Sign Up button */}
                <div>
                    <button type="submit"
                        className="btn btn-secondary dark:btn-primary w-full rounded-lg text-white">
                        Sign Up
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-base-200" />
                    <div className="text-xs text-neutral-500 dark:text-primary">or</div>
                    <div className="flex-1 h-px bg-base-200" />
                </div>

                {/* Google login */}
                <GoogleLogin />
            </form>

            {/* Bottom navigator -> Sign In */}
            <div className="mt-6 text-center text-sm text-neutral-700 dark:text-accent">
                Already have an account?{" "}
                <Link to="/auth/signin" className="font-medium 
                text-secondary dark:text-primary hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default SignUp
