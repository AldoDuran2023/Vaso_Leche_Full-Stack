import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Obtener usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden px-2 py-2">
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                className="bg-gray-800 text-gray-100 w-64 flex-shrink-0"
            />

            <div className="flex-1 flex flex-col ml-4 overflow-hidden">
                <Navbar
                    toggleSidebar={toggleSidebar}
                    user={usuario}
                    onLogout={handleLogout}
                    className="bg-white shadow-md border-b-2 border-red-500 z-10"
                />

                <main className="flex-1 overflow-auto p-4 bg-blue-100 mt-4 rounded-lg">
                    <div className="max-w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
