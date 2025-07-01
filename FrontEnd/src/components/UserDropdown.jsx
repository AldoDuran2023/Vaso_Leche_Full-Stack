import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const UserDropdown = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const cargo = usuario?.cargo;

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón del usuario */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition duration-200"
            >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                    {user?.username || 'Usuario'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                        {/* Información del usuario */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.username || 'Usuario'}</p>
                            <p className="text-sm text-gray-500">{cargo || 'Administrador'}</p>
                        </div>

                        {/* Opciones del menú */}
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                            onClick={() => {
                                setIsOpen(false);
                                navigate(`/usuarios/editar/${user?.id_usuario}`);
                            }}
                        >
                            <User className="w-4 h-4 mr-3" />
                            Mi Perfil
                        </button>

                        <div className="border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;