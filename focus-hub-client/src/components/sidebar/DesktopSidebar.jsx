import { useState } from "react";
import Classes from "../../pages/classScheduleTracker/ClassScheduleTracker";
import { X } from "lucide-react";
import AddClass from "../../features/classschedule/AddClass";
import { AnimatePresence, motion } from "motion/react"
import AddTask from "../../features/Tasks/AddTask";
import SidebarButton from "../buttons/SidebarModelOpenButton/SidebarButton";

const DesktopSidebar = ({ navLinks, logout, setDrawerOpen, drawerOpen }) => {
    const [extraNavs, setExtraNavs] = useState([]);
    // const [showClock, setShowClock] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const handleAddNav = () => {
        // Example: Add a new UL with some placeholder items
        if (extraNavs.length <= 0) {
            const newNav = (
                <AnimatePresence>
                    <motion.ul
                        key={extraNavs.length}
                        initial={{ opacity: 0, y: -20, }}   // starts slightly up and transparent
                        animate={{ opacity: 1, y: 0 }}     // slides down and fades in
                        exit={{ opacity: 0, y: -20, }}      // slides up and fades out
                        transition={{ duration: 0.4, ease: "easeInOut" }} className="space-y-2  text-lg font-medium mt-4 my-4 pt-2 border-l px-1 border-primary">
                        <li>
                            {/* <button className="btn btn-secondary text-black" onClick={() => document.getElementById('my_modal_1').showModal()}>Add Task</button> */}
                        </li>                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                        <li>
                            <button className="btn btn-secondary text-black" onClick={() => document.getElementById('my_modal_2').showModal()}>Add Class</button>
                        </li>

                    </motion.ul>
                </AnimatePresence >
            );
            setExtraNavs([...extraNavs, newNav]);
        }
        else {
            setExtraNavs([])
        }
    };

    const subjects = [
        { value: "math", label: "Math" },
        { value: "english", label: "English" },
        { value: "bangla", label: "Bangla" },
        { value: "physics", label: "Physics" },
        { value: "chemistry", label: "Chemistry" },
        { value: "biology", label: "Biology" },
        { value: "ict", label: "ICT" },
        { value: "religion", label: "Religion" },
        { value: "economics", label: "Economics" },
        { value: "geography", label: "Geography" }
    ];
    return (
        <aside className={`lg:flex lg:translate-x-0 flex-col w-64 
            border-r border-black lg:p-4 lg:pl-1
            md:min-w-[240px] not-dark:bg-primary dark:bg-black dark:text-primary  
            shadow-lg z-50 h-screen fixed lg:sticky top-0
        ${drawerOpen ? 'translate-x-0 ' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out`}>
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 pl-1">
                {/* PLACE YOUR LOGO + SITE NAME HERE */}
                {/* Example: <img src="/logo.png" alt="StudentLife" className="w-8 h-8 rounded" /> */}
                <div className="px-2 flex justify-between w-full">
                    <div>
                        <div className="text-xl font-bold">[LOGO]</div>
                        <div className="text-sm font-semibold">Focus Hub</div>
                    </div>
                    <button
                        aria-label="Close menu"
                        onClick={() => setDrawerOpen(false)}
                        className="p-1 block lg:hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary/60"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* sidebar links */}
            <nav className="flex-1 overflow-auto p-4">
                {/* navlinks */}
                <ul className="space-y-5 text-lg font-medium mb-10">{navLinks}</ul>

                {/* add new Button and more */}
                <AnimatePresence>
                    {showNav &&
                        <motion.ul
                            key={extraNavs.length}
                            initial={{ opacity: 0, y: -20, }}   // starts slightly up and transparent
                            animate={{ opacity: 1, y: 0 }}     // slides down and fades in
                            exit={{ opacity: 0, y: -20, }}      // slides up and fades out
                            transition={{ duration: 0.4, ease: "easeInOut" }} className="space-y-2  text-lg font-medium mt-4 my-4 pt-2 border-l-2 px-1 border-accent">
                            <li>
                                <SidebarButton
                                    modalName={`my_modal_2`} // my_modal_2 for classes
                                    text={`Add Class`}
                                />
                            </li>                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                            <li>
                                <SidebarButton
                                    modalName={`my_modal_1`} // my_modal_1 for tasks
                                    text={`Add Task`}
                                />
                            </li>

                        </motion.ul>}
                </AnimatePresence >

                <button onClick={() => setShowNav(!showNav)} className="btn not-dark:btn-secondary dark:bg-black dark:border-accent hover:shadow-2xl text-white  font-bold w-32 mx-auto ml-3">{
                    showNav ? 'Close' : 'Add New'
                }</button>
            </nav>

            {/* logout button */}
            <div className="p-4 ">
                {/* small footer / version or logout */}
                <button onClick={() => logout()} className="btn btn-ghost btn-lg text-black not-dark:hover:text-white hover:border-none hover:bg-secondary dark:text-white w-full justify-start">
                    Logout
                </button>
            </div>

            {/* dialog for add class */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box max-w-4xl mx-auto p-0">
                    <AddClass />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {/* dialog for add task */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box max-w-4xl mx-auto p-0">
                    <AddTask />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </aside>
    );
};

export default DesktopSidebar;