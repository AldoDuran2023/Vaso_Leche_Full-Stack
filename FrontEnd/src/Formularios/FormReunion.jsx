import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
export default function FormReunion() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [juntas, setJuntas] = useState([]);
    const [loading, setLoading] = useState(true);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const juntaUsuario = usuario?.fk_junta;
    const navigate = useNavigate();

    // Cargar datos para los selects
    useEffect(() => {
        const cargarJuntas = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/juntas/");
                const result = await res.json();
                if (result.success) {
                    const juntasActivas = result.data.filter(j => j.estado === 1); // Solo juntas activas
                    setJuntas(juntasActivas);
                    if (juntaUsuario) {
                        const existe = juntasActivas.some(j => j.id_junta === juntaUsuario);
                        if (existe) setValue("fk_junta", String(juntaUsuario));
                    }
                } else {
                    alert("Error al cargar juntas: " + result.message);
                }
            } catch (error) {
                console.error("Error cargando juntas:", error);
                alert("Error al cargar juntas: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        cargarJuntas();
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log("Datos a enviar:", data);

            const response = await fetch("http://localhost:5000/api/reuniones/nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fk_junta: parseInt(data.fk_junta),
                    fecha_hora: data.fecha_hora,
                    lugar: data.lugar,
                    motivo: data.motivo
                })
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (result.success) {
                await Swal.fire({
                    title: "Runion Registrado",
                    text: result.message,
                    icon: "success"
                });
                navigate('/reuniones');
            } else {
                await Swal.fire({
                    title: "Error al generar la reunión",
                    text: result.message || result.error,
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen to-emerald-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Programar Reunión
                        </h1>
                        <p className="text-gray-600">Registre una nueva reunión para la junta directiva</p>
                    </div>

                    <div className="space-y-6">
                        {/* Junta */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 hidden">
                                Junta Directiva <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_junta", { required: "Debe seleccionar una junta" })}
                                className={`hidden w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fk_junta ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Seleccione una junta</option>
                                {juntas.map(junta => (
                                    <option key={junta.id_junta} value={junta.id_junta}>{junta.nombre}</option>
                                ))}
                            </select>
                            {errors.fk_junta && <p className="text-red-500 text-sm mt-1">{errors.fk_junta.message}</p>}
                        </div>

                        {/* Fecha y Hora */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha y Hora <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                {...register("fecha_hora", {
                                    required: "La fecha y hora son obligatorias",
                                    validate: value => {
                                        const selectedDate = new Date(value);
                                        const now = new Date();
                                        return selectedDate > now || "La fecha debe ser futura";
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fecha_hora ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors.fecha_hora && <p className="text-red-500 text-sm mt-1">{errors.fecha_hora.message}</p>}
                        </div>

                        {/* Lugar */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lugar de la Reunión <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("lugar", {
                                    required: "El lugar es obligatorio",
                                    minLength: {
                                        value: 5,
                                        message: "El lugar debe tener al menos 5 caracteres"
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.lugar ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Ej: Salón Municipal, Auditorio Central, etc."
                            />
                            {errors.lugar && <p className="text-red-500 text-sm mt-1">{errors.lugar.message}</p>}
                        </div>

                        {/* Motivo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Motivo de la Reunión <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("motivo", {
                                    required: "El motivo es obligatorio",
                                    minLength: {
                                        value: 10,
                                        message: "El motivo debe tener al menos 10 caracteres"
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: "El motivo no puede exceder 500 caracteres"
                                    }
                                })}
                                rows="4"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${errors.motivo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Describa el motivo o agenda de la reunión (ejemplo: Revisión del presupuesto mensual, planificación de actividades, evaluación de beneficiarias, etc.)"
                            />
                            {errors.motivo && <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>}
                        </div>

                        {/* Información adicional */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 mb-1">Información importante</h4>
                                    <p className="text-sm text-green-700">
                                        Al registrar la reunión, se generarán automáticamente las asistencias para todos
                                        los miembros de la junta seleccionada. Asegúrese de que la fecha, hora y lugar
                                        sean correctos antes de continuar.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/reuniones')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Programar Reunión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}