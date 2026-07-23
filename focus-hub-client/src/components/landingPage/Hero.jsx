import { Link } from "react-router";
import homePage from "../../assets/comp-2.png"
import { motion } from "motion/react";
const Hero = () => {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-base-100 to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

            {/* Blur Effects */}
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"></div>

            <div className="relative container mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    {/* Left */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.15,
                                },
                            },
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="badge badge-info badge-outline mb-6 px-4 py-3"
                        >
                            Student Productivity Toolkit
                        </motion.div>

                        {/* <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl lg:text-7xl font-black leading-tight"
                        >
                            Study <span className="text-sky-500">Smarter</span>,
                            <br />
                            Stay <span className="text-cyan-600">Organized</span>.
                        </motion.h1> */}
                        <motion.h1
                            className="text-5xl lg:text-7xl font-black leading-tight"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                            }}
                        >
                            Study <span className="text-sky-500">Smarter</span>,
                            <br />
                            Stay <span className="text-cyan-600">Organized</span>.
                        </motion.h1>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="mt-7 max-w-xl text-lg opacity-70 leading-8"
                        >
                            FocusHub helps students manage classes, tasks, notes, exams,
                            budgets, and study schedules in one beautiful workspace.
                        </motion.p>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 },
                            }}
                            transition={{ duration: 0.5 }}
                            className="my-2 text-red-600"
                        >
                            <b>#</b> You need to login first to get started
                        </motion.p>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link
                                to="/auth/signup"
                                className="btn border-none bg-[#0284C7] hover:bg-sky-700 text-white px-8"
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/auth/signin"
                                className="btn btn-outline border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white px-8"
                            >
                                Login
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="mt-12 flex gap-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold">All-in-One</h2>
                                <p className="opacity-60">Student Workspace</p>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold">100%</h2>
                                <p className="opacity-60">Free to Use</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right */}
                    <div className="relative hidden lg:flex justify-center">

                        <img
                            src={homePage}
                            class="max-w-2xl rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;