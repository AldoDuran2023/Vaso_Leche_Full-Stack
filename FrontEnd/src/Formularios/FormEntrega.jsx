import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function FormEntrega() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [representantes, setRepresentantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fk_representante = usuario?.fk_representante;
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Llamada para Representantes
                const respRepresentantes = await fetch('http://localhost:5000/api/representantes/');
                const dataRepresentantes = await respRepresentantes.json();
                if (dataRepresentantes.success) {
                    const listaRepresentantes = dataRepresentantes.data.map(r => ({
                        id: r.id_representante,
                        nombre: `${r.nombres}`
                    }));
                    setRepresentantes(listaRepresentantes);
                    if (fk_representante) {
                        setValue("fk_representante", fk_representante);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:5000/api/entregas/nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                await Swal.fire({
                    title: "Entrega registrada",
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                navigate("/entregas");
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }

        } catch (error) {
            await Swal.fire({
                title: "Error en la solicitud",
                text: error.message,
                icon: "error",
                confirmButtonText: "Cerrar"
            });
        }
    };

    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getFechaActual = () => {
        const ahora = new Date();
        return ahora.toISOString().split('T')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen to-teal-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Nueva Entrega
                        </h1>
                        <p className="text-gray-600">Registrar una nueva entrega con sus detalles automáticos</p>
                    </div>

                    <div className="space-y-6">
                        {/* Representante */}
                        <div>
                            <label className="hidden block text-sm font-semibold text-gray-700 mb-2">
                                Representante <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_representante", { required: "Debe seleccionar un representante" })}
                                className={`hidden w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fk_representante ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Seleccione un representante</option>
                                {representantes.map(representante => (
                                    <option key={representante.id} value={representante.id}>
                                        {representante.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.fk_representante && (
                                <p className="text-red-500 text-sm mt-1">{errors.fk_representante.message}</p>
                            )}
                        </div>


                        {/* Fecha de Entrega */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Entrega <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("fecha_entrega", {
                                    required: "La fecha de entrega es obligatoria",
                                    validate: value => {
                                        const selectedDate = new Date(value);
                                        const now = new Date();
                                        return selectedDate > now || "La fecha debe ser futura";
                                    }
                                })}
                                defaultValue={getFechaActual()}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fecha_entrega ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors.fecha_entrega && (
                                <p className="text-red-500 text-sm mt-1">{errors.fecha_entrega.message}</p>
                            )}
                        </div>

                        {/* Información del proceso */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 mb-1">Proceso automático</h4>
                                    <p className="text-sm text-green-700">
                                        Al crear la entrega, el sistema generará automáticamente todos los detalles
                                        de productos correspondientes según la configuración de la junta del representante seleccionado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Flujo del proceso */}
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Flujo del proceso:</h4>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">1</div>
                                    <span>Se crea el registro de entrega</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">2</div>
                                    <span>Se generan automáticamente los detalles de productos</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">3</div>
                                    <span>Se confirma la operación exitosa</span>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate("/entregas")}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Crear Entrega
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}