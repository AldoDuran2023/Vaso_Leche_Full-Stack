import React from "react";
import { NavLink } from "react-router-dom";
import { Layout, Edit3, ContactRound, Bell, User, ArrowRight, HandPlatter, CircleDollarSign, IdCard, Package } from 'lucide-react';
// Rutas de enlace del Sidebar
const links = [
    { name: "Inicio", icon: <Layout className="h-5 w-5" />, to: "/" },
    { name: "Beneficiarias", icon: <Edit3 className="h-5 w-5" />, to: "/beneficiarias" },
    { name: "Juntas Directivas", icon: <IdCard className="h-5 w-5" />, to: "/juntas" },
    { name: "Representantes", icon: <ContactRound className="h-5 w-5" />, to: "/representantes" },
    { name: "Reuniones", icon: <Bell className="h-5 w-5" />, to: "/reuniones" },
    { name: "Reparticion", icon: <HandPlatter className="h-5 w-5" />, to: "/entregas" },
    { name: "Ingresar Viveres", icon: <Package className="h-5 w-5" />, to: "/ingresos_viveres" },
    { name: "Tesoreria", icon: <CircleDollarSign className="h-5 w-5" />, to: "/tesoreria" },
    { name: "Gastos", icon: <ArrowRight className="h-5 w-5" />, to: "/gastos" },
    { name: "Usuarios", icon: <User className="h-5 w-5" />, to: "/usuarios" },
];

// Componente Sidebar
export default function Sidebar({ open, setOpen }) {
    return (
        <div>
            <aside
                className={`h-screen overflow-y-auto rounded-lg fixed z-40 inset-y-0 left-0 w-64 bg-white border border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:inset-0`}
            >

                {/* Header Section */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center group">
                        <div className="p-2 bg-blue-100 rounded-lg transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-105">
                            <Layout className="h-6 w-6 text-blue-600 transition-all duration-300 group-hover:text-blue-700" />
                        </div>
                        <span className="ml-3 font-bold text-xl text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                            Panel Admin
                        </span>
                    </div>
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        onClick={() => setOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Section */}
                <div className="flex flex-col flex-grow px-4 py-6">
                    <nav className="flex flex-col space-y-2">
                        {links.map((link, index) => (
                            <NavLink
                                key={link.name}
                                to={link.to}
                                className={({ isActive }) =>
                                    `group flex items-center px-4 py-3 rounded-xl text-gray-600 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95
                                hover:bg-blue-50 hover:text-blue-700 hover:shadow-md
                                ${isActive
                                        ? "bg-blue-100 text-blue-700 font-semibold shadow-md border border-blue-200"
                                        : "hover:border hover:border-blue-100"
                                    }`
                                }
                                onClick={() => setOpen(false)}
                            >
                                {/* Icon container */}
                                <div className="p-2 rounded-lg transition-all duration-200 group-hover:bg-blue-100 group-hover:scale-110">
                                    {React.cloneElement(link.icon, {
                                        className: "h-5 w-5 transition-all duration-200"
                                    })}
                                </div>

                                {/* Text */}
                                <span className="ml-3 font-medium transition-all duration-200 group-hover:translate-x-1">
                                    {link.name}
                                </span>

                                {/* Active indicator */}
                                <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-200 ${({ isActive }) => isActive ? 'bg-blue-500' : 'opacity-0 group-hover:opacity-100 bg-blue-300'
                                    }`}></div>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer Section */}
                    <div className="mt-auto pt-6">
                        <div className="flex items-center justify-center space-x-2 py-4 px-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-500 font-medium">Sistema Beneficiarias</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}