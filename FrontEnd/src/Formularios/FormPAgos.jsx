import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Receipt } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FormPagoMultas() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [beneficiaria, setBeneficiaria] = useState(null);
    const [representantes, setRepresentantes] = useState([]);
    const [multas, setMultas] = useState([]);
    const [multasSeleccionadas, setMultasSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_representante = usuario?.fk_representante;

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Obtener representantes
                const resReps = await fetch("http://localhost:5000/api/representantes/");
                const dataReps = await resReps.json();
                if (dataReps.success) {
                    setRepresentantes(dataReps.data.map(r => ({
                        id: r.id_representante,
                        nombre: `${r.nombres}`
                    })));
                    if (id_representante) {
                        setValue("fk_representante", String(id_representante));
                    }
                }


                // Obtener multas
                const resMultas = await fetch(`http://localhost:5000/api/multas/${id}`);
                const dataMultas = await resMultas.json();
                if (dataMultas.success) {
                    const pendientes = dataMultas.data.filter(m => m.estado === "Pendiente");
                    if (pendientes.length === 0) {
                        alert("Esta beneficiaria no tiene multas pendientes.");
                        return navigate("/tesoreria");
                    }
                    setMultas(pendientes);

                    // ✅ Guardar info de la beneficiaria
                    setBeneficiaria({
                        id: pendientes[0].id_beneficiaria,
                        nombre: pendientes[0].beneficiaria
                    });
                }

                setLoading(false);
            } catch (err) {
                alert("Error al cargar los datos: " + err.message);
                navigate("/tesoreria");
            }
        };

        cargarDatos();
    }, [id, navigate, setValue]);

    const toggleMultaSeleccionada = (multa) => {
        setMultasSeleccionadas(prev => {
            const isSelected = prev.some(m => m.id_multa === multa.id_multa);
            if (isSelected) {
                return prev.filter(m => m.id_multa !== multa.id_multa);
            } else {
                return [...prev, multa];
            }
        });
    };

    const seleccionarTodasMultas = () => {
        const newMultas = multas.filter(multa => !multasSeleccionadas.some(sm => sm.id_multa === multa.id_multa));
        setMultasSeleccionadas(prev => [...prev, ...newMultas]);
    };

    const limpiarSeleccion = () => setMultasSeleccionadas([]);

    const calcularTotal = () => multasSeleccionadas.reduce((t, m) => t + parseFloat(m.monto), 0).toFixed(2);

    const procesarPago = async (data) => {
        if (multasSeleccionadas.length === 0) {
            await Swal.fire({
                title: "Atención",
                text: "Seleccione al menos una multa.",
                icon: "warning"
            });
            return;
        }

        try {
            const pagoData = {
                fk_beneficiaria: beneficiaria.id,
                fk_representante: data.fk_representante,
                fecha_pago: data.fecha_pago,
                multas_pagadas: multasSeleccionadas.map(m => m.id_multa)
            };

            const response = await fetch("http://localhost:5000/api/movimientos/nuevo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pagoData)
            });

            const result = await response.json();
            if (result.success) {
                await Swal.fire({
                    title: "Pago registrado",
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                navigate('/pagos');
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error"
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "Error al registrar el pago",
                text: error.message,
                icon: "error"
            });
        }
    };


    const getFechaActual = () => new Date().toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 mb-4"></div>
                    <p className="text-xl text-gray-700 font-semibold">Cargando datos de multas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
                {/* Encabezado estilizado - Pago de Multas */}
                <div className="text-center mb-8 mt-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <Receipt className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Pago de Multas</h1>
                    {beneficiaria && (
                        <p className="text-xl text-red-600 font-semibold">Para: {beneficiaria.nombre}</p>
                    )}
                    <p className="text-gray-600 text-lg mt-2">Gestiona las multas pendientes de la beneficiaria.</p>
                </div>


                <form onSubmit={handleSubmit(procesarPago)} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Multas */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <span>Multas Pendientes ({multas.length})</span>
                                {multas.length === 0 && <span className="ml-2 text-green-600">🎉 ¡Sin multas!</span>}
                            </h3>

                            {multas.length > 0 ? (
                                <>
                                    {/* Multas List */}
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar rounded-lg p-4 bg-gray-50">
                                        {multas.map(multa => (
                                            <div
                                                key={multa.id_multa}
                                                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                                                ${multasSeleccionadas.some(m => m.id_multa === multa.id_multa)
                                                        ? "bg-blue-50 border-blue-300 shadow-sm border-2"
                                                        : "bg-white border-gray-200 hover:bg-gray-100 border"
                                                    }`}
                                                onClick={() => toggleMultaSeleccionada(multa)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={multasSeleccionadas.some(m => m.id_multa === multa.id_multa)}
                                                        onChange={() => toggleMultaSeleccionada(multa)}
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-lg text-gray-800">{multa.tipo}</p>
                                                        <p className="text-sm text-gray-500">{multa.descripcion}</p>
                                                    </div>
                                                </div>
                                                <p className="text-red-600 font-extrabold text-xl">S/ {parseFloat(multa.monto).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons for Multas */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={seleccionarTodasMultas}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors duration-200"
                                        >
                                            Seleccionar todas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={limpiarSeleccion}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow transition-colors duration-200"
                                        >
                                            Limpiar Selección
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                                    <p className="font-bold">¡Excelente!</p>
                                    <p>Esta beneficiaria no tiene multas pendientes de pago.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Payment Details */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">Detalles del Pago</h3>

                            {/* Summary of Selected Multas */}
                            {multasSeleccionadas.length > 0 && (
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <p className="text-gray-700 text-lg font-semibold mb-3">Multas Seleccionadas:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                                        {multasSeleccionadas.map(multa => (
                                            <li key={multa.id_multa} className="text-sm">
                                                {multa.tipo} - S/ {parseFloat(multa.monto).toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="border-t border-blue-300 mt-3 pt-3">
                                        <p className="text-right text-xl font-bold text-blue-700">
                                            Total: S/ {calcularTotal()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Representative Selection */}
                            <div>
                                <label htmlFor="fk_representante" className="hidden block text-lg font-semibold text-gray-700 mb-2">
                                    Representante que Realiza el Pago *
                                </label>
                                <select
                                    id="fk_representante"
                                    {...register("fk_representante", { required: "Seleccione un representante" })}
                                    defaultValue={id_representante}
                                    disabled
                                    className="hidden w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base shadow-sm bg-gray-100 cursor-not-allowed"
                                >
                                    {representantes.map(rep => (
                                        <option key={rep.id} value={rep.id}>{rep.nombre}</option>
                                    ))}
                                </select>

                                {errors.fk_representante && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_representante.message}</p>
                                )}
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label htmlFor="fecha_pago" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Fecha de Pago *
                                </label>
                                <input
                                    type="date"
                                    id="fecha_pago"
                                    {...register("fecha_pago", { required: "Fecha de pago es requerida" })}
                                    defaultValue={getFechaActual()}
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base shadow-sm"
                                />
                                {errors.fecha_pago && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fecha_pago.message}</p>
                                )}
                            </div>

                            {/* Payment Summary Card */}
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                                <div className="text-center">
                                    <p className="text-gray-700 text-lg font-semibold mb-2">
                                        Multas seleccionadas: {multasSeleccionadas.length}
                                    </p>
                                    <p className="text-3xl font-bold text-green-700">
                                        Total a Pagar: S/ {calcularTotal()}
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={multasSeleccionadas.length === 0}
                                className={`w-full font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-2 text-lg
                                    ${multasSeleccionadas.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 focus:ring-green-500'
                                    }`}
                            >
                                {multasSeleccionadas.length === 0
                                    ? 'Seleccione multas para continuar'
                                    : `Finalizar Pago - S/ ${calcularTotal()}`
                                }
                            </button>
                        </div>
                    </div>
                </form>

                {/* Back button */}
                <div className="text-center p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate("/tesoreria")}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Volver a Tesorería
                    </button>
                </div>
            </div>
        </div>
    );
}