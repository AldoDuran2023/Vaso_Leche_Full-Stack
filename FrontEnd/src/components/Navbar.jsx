import React from 'react';
import { Menu, Search } from 'lucide-react';
import UserDropdown from './UserDropdown';

const Navbar = ({ toggleSidebar, user, onLogout }) => {
    return (
        <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-10 rounded-lg">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-700 text-xl focus:outline-none md:hidden"
                >
                    <Menu />
                </button>

                <h1 className="text-lg font-semibold text-gray-800">Acovichay Alto</h1>
            </div>

            <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 ml-4">
                <UserDropdown user={user} onLogout={onLogout} />
            </div>
        </nav>
    );
};

export default Navbar;
