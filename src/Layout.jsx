import { useState } from 'react';
import { Outlet } from "react-router"
import Navbar from "./component/Navbar"
import SideNav from "./component/SideNav"

const Layout = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const toggleSideNav = () => {
        setIsSideNavOpen((prev) => !prev);
    };
    return (
        <>
            <div className="w-full fixed z-[999]">
                <Navbar handleSideNav={toggleSideNav} />
            </div>
            <div className={`side-nav-container ${isSideNavOpen ? 'w-64' : 'w-16'} hover:w-64`}>
                <SideNav isSideNavOpen={isSideNavOpen} />
            </div>
             {/* Main Content - Prevent full-page scroll */}
             <main className={`flex-1 transition-all pt-14 ${isSideNavOpen ? 'ml-64' : 'ml-16'} h-screen overflow-hidden`}>
                {/* Scroll only inside Outlet */}
                <div className="p-6 space-y-6 ts-body h-full overflow-auto">
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default Layout