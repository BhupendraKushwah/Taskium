import { useState } from 'react';
import { Outlet } from "react-router";
import Navbar from "./component/Navbar";
import SideNav from "./component/SideNav";

const Layout = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const toggleSideNav = () => {
        setIsSideNavOpen((prev) => !prev);
    };

    return (
        <>
            {/* Navbar - Fixed at the top */}
            <div className="w-full fixed z-[999] bg-white dark:bg-gray-800 dark:border-gray-700">
                <Navbar handleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} />
            </div>

            {/* Side Navigation */}
            <div className={`side-nav-container fixed top-14 h-screen ${isSideNavOpen ? 'w-64' : 'w-16'} hover:w-64 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300`}>
                <SideNav isSideNavOpen={isSideNavOpen} />
            </div>

            {/* Main Content - Prevent full-page scroll */}
            <main className={`flex-1 transition-all pt-14 ${isSideNavOpen ? 'ml-64' : 'ml-16'} h-screen overflow-hidden bg-gradient-to-br from-base-white-darker to-base-white-dark dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800`}>
                {/* Scroll only inside Outlet */}
                <div className="p-2 space-y-6 ts-body h-full overflow-auto dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-900">
                    <Outlet />
                </div>
            </main>
        </>
    );
};

export default Layout;