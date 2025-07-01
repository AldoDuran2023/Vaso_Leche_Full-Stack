import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react'; // Asegúrate de tener instalada la librería lucide-react para los iconos.

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const [mensaje, setMensaje] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Para alternar la visibilidad de la contraseña

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMensaje('');

        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem("token", result.token);
                const usuario = jwtDecode(result.token);
                localStorage.setItem("usuario", JSON.stringify(usuario));

                setMensaje("Inicio de sesión exitoso");

                if (onLogin) {
                    onLogin();
                }

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMensaje(result.message || result.error || 'Credenciales incorrectas');
            }

        } catch (error) {
            setMensaje('Error de conexión con el servidor');
            console.error('Error de login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-6 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Sistema de Gestión
                    </h1>
                    <p className="text-gray-600 font-medium">
                        Programa Nacional "Vaso de Leche"
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-8 py-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Iniciar Sesión
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Ingrese sus credenciales para acceder al sistema
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        {...register('username', { required: 'El usuario es obligatorio' })}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${formErrors.username
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                            }`}
                                        placeholder="Ingrese su usuario"
                                        disabled={isLoading}
                                    />
                                </div>
                                {formErrors.username && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                        {formErrors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', { required: 'La contraseña es obligatoria' })}
                                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${formErrors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                            }`}
                                        placeholder="Ingrese su contraseña"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                        {formErrors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                        Verificando credenciales...
                                    </div>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        {/* Message Display */}
                        {mensaje && (
                            <div className={`mt-6 p-4 rounded-lg text-sm font-medium text-center transition-all duration-300 ${mensaje.includes('exitoso')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                <div className="flex items-center justify-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${mensaje.includes('exitoso') ? 'bg-green-400' : 'bg-red-400'
                                        }`}></span>
                                    {mensaje}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-500">
                            © 2025 Programa Nacional "Vaso de Leche" del Perú
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        ¿Problemas para acceder? Contacte al administrador del sistema
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;