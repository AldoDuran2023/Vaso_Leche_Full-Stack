import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function FormJunta() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fk_representante = usuario?.fk_representante;
    const navigate = useNavigate();


    const onSubmit = async (data) => {
        const payload = {
            nombre: data.nombre,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin
        };

        try {
            const response = await fetch("http://localhost:5000/api/juntas/nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    title: "Junta Directiva registrado",
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                navigate('/juntas')
            } else {
                await Swal.fire({
                    title: "Error al registrar la Junta",
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M2 20h5v-2a3 3 0 00-5.356-1.857M12 13a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zm-12 0a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Nueva Junta directiva
                        </h1>
                        <p className="text-gray-600">Registrar la nueva Junta Directiva.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("nombre", {
                                    required: "El nombre es obligatorio"
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Ingrese el nombre"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                        </div>

                        {/* Fecha de Inicio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Inicio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("fecha_inicio", {
                                    required: "La fecha de entrega es obligatoria"
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fecha_inicio ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            />
                            {errors.fecha_inicio && (
                                <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>
                            )}
                        </div>

                        {/* Fecha de Final */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Finalización <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                {...register("fecha_fin", {
                                    required: "La fecha de entrega es obligatoria"
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fecha_fin ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            />
                            {errors.fecha_fin && (
                                <p className="text-red-500 text-sm mt-1">{errors.fecha_fin.message}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/juntas')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit" // Cambiado a submit para que handleSubmit lo maneje
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Registrar Junta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}