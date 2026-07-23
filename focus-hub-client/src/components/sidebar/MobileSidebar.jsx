import { X } from "lucide-react";

const MobileSidebar = ({ setDrawerOpen, navLinks, logout }) => {
    return (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="w-72 bg-primary text-base-100 shadow-xl flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-primary/30">
                    <div>
                        <div className="text-lg font-bold">[LOGO]</div>
                        <div className="text-sm font-semibold">Focus Hub</div>
                    </div>
                    <button
                        aria-label="Close menu"
                        onClick={() => setDrawerOpen(false)}
                        className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/60"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-auto p-4">
                    <ul className="space-y-3 text-sm">{navLinks}</ul>
                </nav>

                <div className="p-4 border-t border-primary/30">
                    <button onClick={() => {
                        logout()
                        setDrawerOpen(false)
                    }} className="btn btn-ghost btn-sm w-full justify-start text-base-100/90">
                        Logout
                    </button>
                </div>
            </div>

            <div
                className="flex-1 bg-black bg-opacity-40"
                onClick={() => setDrawerOpen(false)}
            />
        </div>
    );
};

export default MobileSidebar;