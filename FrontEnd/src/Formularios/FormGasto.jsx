import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function FormGasto() {
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();
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

                    // Seleccionar automáticamente si el representante existe
                    const existe = listaRepresentantes.some(r => r.id === fk_representante);
                    if (existe) {
                        setValue("fk_representante", String(fk_representante));
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setLoading(false);
            }
        };

        cargarDatos();
    }, [setValue]);

    const onSubmit = async (data) => {
        const payload = {
            fk_representante: data.fk_representante,
            motivo: data.motivo_gasto,
            fecha: data.fecha_gasto,
            monto: parseFloat(data.monto_gasto)
        };

        try {
            const response = await fetch("http://localhost:5000/api/gastos/nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    title: "Gasto registrado",
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                navigate("/gastos");
            } else {
                await Swal.fire({
                    title: "Error al registrar el gasto",
                    text: result.error || result.message || "Error desconocido",
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Nuevo Gasto
                        </h1>
                        <p className="text-gray-600">Registrar un nuevo gasto con sus detalles.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Representante */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Representante <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_representante", { required: "Debe seleccionar un representante" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fk_representante ? 'border-red-500 bg-red-50' : 'border-gray-300'
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

                        {/* Motivo del Gasto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Motivo del Gasto <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("motivo_gasto", { required: "El motivo del gasto es obligatorio" })}
                                placeholder="Ej. Transporte, Alimentos, Materiales..."
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.motivo_gasto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors.motivo_gasto && (
                                <p className="text-red-500 text-sm mt-1">{errors.motivo_gasto.message}</p>
                            )}
                        </div>

                        {/* Monto del Gasto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Monto del Gasto <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01" // Permite decimales
                                {...register("monto_gasto", {
                                    required: "El monto del gasto es obligatorio",
                                    min: { value: 0.01, message: "El monto debe ser mayor a 0" },
                                    valueAsNumber: true // Convierte el valor a número automáticamente
                                })}
                                placeholder="Ej. 25.50"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.monto_gasto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors.monto_gasto && (
                                <p className="text-red-500 text-sm mt-1">{errors.monto_gasto.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit" // Cambiado a submit para que handleSubmit lo maneje
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Registrar Gasto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}