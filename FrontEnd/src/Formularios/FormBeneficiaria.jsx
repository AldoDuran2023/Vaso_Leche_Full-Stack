import { React, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function FormBeneficiaria() {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Cargar datos si estamos editando
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/api/beneficiarias/${id}`)
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        const data = result.data;
                        setValue("id_beneficiaria", data.id_beneficiaria);
                        setValue("dni", data.dni);
                        setValue("nombres", data.nombre);
                        setValue("apellido_paterno", data.ap_paterno);
                        setValue("apellido_materno", data.ap_materno);
                        setValue("direccion", data.direccion);
                        const fecha = new Date(data.fecha_nacimiento);
                        const fechaFormateada = fecha.toISOString().split("T")[0];
                        setValue("fecha_nacimiento", fechaFormateada);
                        setValue("fk_tipo_beneficiaria", data.tipo === "gestante" ? 1 : 2);
                        setValue("telefono", data.telefono);
                        setValue("sisfoh", data.sisfoh);
                    }
                });
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const url = id
            ? "http://localhost:5000/api/beneficiarias/actualizar"
            : "http://localhost:5000/api/beneficiarias/registrar";

        const method = id ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                await Swal.fire({
                    title: id ? "¡Actualización exitosa!" : "¡Registro exitoso!",
                    text: id
                        ? "Beneficiaria actualizada correctamente"
                        : "Beneficiaria registrada correctamente",
                    icon: "success"
                });
                navigate("/beneficiarias");
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error"
                });
                print(result.message)
            }
        } catch (error) {
            await Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        }
    };

    return (
        <div className="h-screen to-indigo-100 px-4 overflow-hidden">
            <div className="max-w-2xl mx-auto h-full flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[95vh] w-full">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Registro de Beneficiaria
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Complete todos los campos para registrar a la beneficiaria
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* DNI */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                DNI <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("dni", {
                                    required: "El DNI es obligatorio",
                                    pattern: {
                                        value: /^\d{8}$/,
                                        message: "El DNI debe tener 8 dígitos"
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dni ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Ingrese el DNI"
                            />
                            {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>}
                        </div>

                        {/* Nombres */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombres Completos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("nombres", { required: "Los nombres son obligatorios" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombres ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Ingrese los nombres completos"
                            />
                            {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres.message}</p>}
                        </div>

                        {/* Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Apellido Paterno <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("apellido_paterno", { required: "El apellido paterno es obligatorio" })}
                                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.apellido_paterno ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Apellido paterno"
                                />
                                {errors.apellido_paterno && <p className="text-red-500 text-sm mt-1">{errors.apellido_paterno.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Apellido Materno <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("apellido_materno", { required: "El apellido materno es obligatorio" })}
                                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.apellido_materno ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Apellido materno"
                                />
                                {errors.apellido_materno && <p className="text-red-500 text-sm mt-1">{errors.apellido_materno.message}</p>}
                            </div>
                        </div>

                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dirección <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("direccion", { required: "La dirección es obligatoria" })}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.direccion ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Ingrese la dirección completa"
                            />
                            {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>}
                        </div>

                        {/* Fecha y Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha de Nacimiento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register("fecha_nacimiento", { required: "La fecha de nacimiento es obligatoria" })}
                                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fecha_nacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.fecha_nacimiento && <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento.message}</p>}
                            </div>
                            <div>
                                <label className="hidden block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Beneficiaria <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("fk_tipo_beneficiaria", { required: "Debe seleccionar un tipo de beneficiaria" })}
                                    className={`hidden w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fk_tipo_beneficiaria ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <option value="1">Gestante</option>
                                    <option value="2">Lactante</option>
                                </select>
                                {errors.fk_tipo_beneficiaria && <p className="text-red-500 text-sm mt-1">{errors.fk_tipo_beneficiaria.message}</p>}
                            </div>
                        </div>

                        {/* Teléfono y SISFOH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Número de Celular <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("telefono", {
                                        required: "El número de celular es obligatorio",
                                        pattern: {
                                            value: /^\d{9}$/,
                                            message: "El número debe tener 9 dígitos"
                                        }
                                    })}
                                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telefono ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Ej: 987654321"
                                />
                                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Código SISFOH <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("sisfoh", { required: "El código SISFOH es obligatorio" })}
                                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.sisfoh ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Ingrese el código SISFOH"
                                />
                                {errors.sisfoh && <p className="text-red-500 text-sm mt-1">{errors.sisfoh.message}</p>}
                            </div>
                        </div>

                        {/* Botón */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                {id ? "Actualizar Beneficiaria" : "Registrar Beneficiaria"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
