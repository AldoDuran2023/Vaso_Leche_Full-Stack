import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function FormRepresentante() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [cargos, setCargos] = useState([]);
    const [juntas, setJuntas] = useState([]);
    const [beneficiarias, setBeneficiarias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Llamada para Cargos
                const respCargos = await fetch('http://localhost:5000/api/cargos/');
                const dataCargos = await respCargos.json();
                if (dataCargos.success) {
                    const listaCargos = dataCargos.data.map(c => ({
                        id: c.id_cargo,
                        nombre: c.cargo
                    }));
                    setCargos(listaCargos);
                }

                // Llamada para Juntas
                const respJuntas = await fetch('http://localhost:5000/api/juntas/');
                const dataJuntas = await respJuntas.json();
                if (dataJuntas.success) {
                    const listaJuntas = dataJuntas.data.map(j => ({
                        id: j.id_junta,
                        nombre: j.nombre
                    }));
                    setJuntas(listaJuntas);
                }

                // Llamada para Beneficiarias
                const respBenef = await fetch('http://localhost:5000/api/beneficiarias/');
                const dataBenef = await respBenef.json();
                if (dataBenef.success) {
                    const listaBenef = dataBenef.data.map(b => ({
                        id: b.id_beneficiaria,
                        nombre: `${b.nombres_completos}`
                    }));
                    setBeneficiarias(listaBenef);
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
            const response = await fetch("http://localhost:5000/api/representantes/nuevo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                await Swal.fire({
                    title: "Registro exitoso",
                    text: "Representante registrado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                navigate('/representantes');
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error"
                });
            }

        } catch (error) {
            await Swal.fire({
                title: "Error en la solicitud",
                text: error.message,
                icon: "error"
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen to-indigo-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Registro de Representante
                        </h1>
                        <p className="text-gray-600">Asigne un cargo a una beneficiaria en una junta específica</p>
                    </div>

                    <div className="space-y-6">
                        {/* Cargo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cargo <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_cargo", { required: "Debe seleccionar un cargo" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.fk_cargo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Seleccione un cargo</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                                ))}
                            </select>
                            {errors.fk_cargo && <p className="text-red-500 text-sm mt-1">{errors.fk_cargo.message}</p>}
                        </div>

                        {/* Junta */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Junta <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_junta", { required: "Debe seleccionar una junta" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.fk_junta ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Seleccione una junta</option>
                                {juntas.map(junta => (
                                    <option key={junta.id} value={junta.id}>{junta.nombre}</option>
                                ))}
                            </select>
                            {errors.fk_junta && <p className="text-red-500 text-sm mt-1">{errors.fk_junta.message}</p>}
                        </div>

                        {/* Beneficiaria */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Beneficiaria <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("fk_beneficiaria", { required: "Debe seleccionar una beneficiaria" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.fk_beneficiaria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Seleccione una beneficiaria</option>
                                {beneficiarias.map(beneficiaria => (
                                    <option key={beneficiaria.id} value={beneficiaria.id}>{beneficiaria.nombre}</option>
                                ))}
                            </select>
                            {errors.fk_beneficiaria && <p className="text-red-500 text-sm mt-1">{errors.fk_beneficiaria.message}</p>}
                        </div>

                        {/* Información adicional */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-purple-800 mb-1">Información importante</h4>
                                    <p className="text-sm text-purple-700">
                                        Al registrar un representante, se asignará el cargo seleccionado a la beneficiaria
                                        en la junta especificada. Verifique que los datos sean correctos antes de continuar.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/representantes')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Registrar Representante
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}