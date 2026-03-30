import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = () => {
    const [sidebarOpen,setSidebarOpen]=useState(false);
    const [open,setOpen]=useState(false);

    return (
        <div className="flex h-screen overflow-hidden">

            <div className="fixed left-0 top-0 h-full w-64 ">
                <Sidebar
                open={open}
                setOpen={setOpen}
                />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col">

                <div className="fixed top-0 lg:left-64 left-0 right-0 h-16 z-10 bg-white shadow">
                    <Navbar 
                    sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                    />
                </div>

                <div className="mt-16 p-4 overflow-y-auto h-[calc(100vh-64px)]">
                    <Outlet />
                </div>

            </div>
        </div>
    )
};

export default Layout;