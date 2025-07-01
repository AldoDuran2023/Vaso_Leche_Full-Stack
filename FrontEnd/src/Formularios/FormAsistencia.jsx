import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

export default function FormularioAsistencia() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/asistencias/${id}`);
                const result = await response.json();

                if (result.success) {
                    // Convertir "estado": "Presente"/"Inasistente" a booleano
                    const procesado = result.data.map(as => ({
                        ...as,
                        estado: as.estado === "Presente" ? 1 : 0
                    }));
                    setAsistencias(procesado);
                } else {
                    alert("Error al cargar asistencias: " + result.message);
                    navigate("/reuniones");
                }
            } catch (err) {
                alert("Error de red: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencias();
    }, [id, navigate]);

    const toggleEstado = (id_asistencia) => {
        setAsistencias(prev =>
            prev.map(as =>
                as.id_asistencia === id_asistencia
                    ? { ...as, estado: as.estado === 1 ? 0 : 1 }
                    : as
            )
        );
    };

    const guardarAsistencia = async () => {
        setGuardando(true);
        try {
            // 1. Actualizar estado de la reunión
            const resReunion = await fetch(`http://localhost:5000/api/reuniones/actualizar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_reunion: id,
                    estado: 1
                })
            });

            const resultadoReunion = await resReunion.json();
            if (!resultadoReunion.success) throw new Error(resultadoReunion.message);

            // 2. Actualizar cada asistencia
            for (const { id_asistencia, estado } of asistencias) {
                const resAsistencia = await fetch("http://localhost:5000/api/asistencias/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_asistencia,
                        estado: Number(estado)
                    })
                });

                const resultAs = await resAsistencia.json();
                if (!resultAs.success) throw new Error(resultAs.message);
            }

            await Swal.fire({
                title: "Runion Registrado",
                text: "Asistencia registrada y reunión finalizada.",
                icon: "success"
            });
            window.history.back();

        } catch (error) {
            await Swal.fire({
                title: "Runion Registrado",
                text: error.message,
                icon: "success"
            });
        } finally {
            setGuardando(false);
        }
    };

    // Calcular estadísticas
    const totalPersonas = asistencias.length;
    const presentes = asistencias.filter(as => as.estado === 1).length;
    const ausentes = totalPersonas - presentes;
    const porcentajeAsistencia = totalPersonas > 0 ? Math.round((presentes / totalPersonas) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">Cargando asistencias...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto"> {/* Increased max-width for better layout */}
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            📋 Lista de Asistencia
                        </h1>
                        <div className="text-sm text-gray-500">
                            Reunión #{id}
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* md:grid-cols-3 for 2/3 and 1/3 split */}
                    {/* Left Column: Participant List (2/3 width on medium screens and up) */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">
                                Participantes ({totalPersonas})
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {asistencias.map((as, index) => (
                                <div
                                    key={as.id_asistencia}
                                    className="p-4 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">
                                                    {as.beneficiaria}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    ID: {as.id_asistencia}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleEstado(as.id_asistencia)}
                                            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md
                                                ${as.estado === 1
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-200"
                                                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-red-200"
                                                }`}
                                        >
                                            <span className="flex items-center space-x-2">
                                                <span>
                                                    {as.estado === 1 ? "✓" : "✗"}
                                                </span>
                                                <span>
                                                    {as.estado === 1 ? "Presente" : "Ausente"}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Stats and Save Button (1/3 width on medium screens and up) */}
                    <div className="md:col-span-1 flex flex-col space-y-6"> {/* Use flex-col and space-y for vertical stacking */}
                        {/* Estadísticas */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Resumen de Asistencia</h2>
                            <div className="grid grid-cols-2 gap-4"> {/* Adjusted to 2 columns for smaller width */}
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{totalPersonas}</div>
                                    <div className="text-sm text-gray-600">Total</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{presentes}</div>
                                    <div className="text-sm text-gray-600">Presentes</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{ausentes}</div>
                                    <div className="text-sm text-gray-600">Ausentes</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{porcentajeAsistencia}%</div>
                                    <div className="text-sm text-gray-600">Asistencia</div>
                                </div>
                            </div>
                        </div>

                        {/* Progreso Visual */}
                        {totalPersonas > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Progreso de Asistencia
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {presentes} de {totalPersonas} presentes
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${porcentajeAsistencia}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Botón de Guardar */}
                        <div className="flex justify-center mt-auto"> {/* mt-auto pushes it to the bottom of the column */}
                            <button
                                onClick={guardarAsistencia}
                                disabled={guardando}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full"
                            >
                                {guardando ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Guardando...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2">
                                        <span>💾</span>
                                        <span>Guardar Asistencia</span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}