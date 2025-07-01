import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export default function FormHijo() {
  const { dni_madre } = useParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      data.dni_madre = dni_madre;

      const response = await fetch(`http://localhost:5000/api/hijos/nuevo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        await Swal.fire({
          title: "Registro exitoso",
          text: "Beneficiaria registrada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar"
        });
        window.history.back();
      } else {
        await Swal.fire({
          title: "Error",
          text: result.error || result.message,
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

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 overflow-hidden">
      <div className="max-w-2xl mx-auto h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[95vh] w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Registro de Hijos
            </h1>
            <p className="text-gray-600 text-sm">
              Complete todos los campos para registrar al hijo
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
                  {...register("ap_paterno", { required: "El apellido paterno es obligatorio" })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.ap_paterno ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Apellido paterno"
                />
                {errors.ap_paterno && <p className="text-red-500 text-sm mt-1">{errors.ap_paterno.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido Materno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("ap_materno", { required: "El apellido materno es obligatorio" })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.ap_materno ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Apellido materno"
                />
                {errors.ap_materno && <p className="text-red-500 text-sm mt-1">{errors.ap_materno.message}</p>}
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

            {/* Fecha y madre */}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partida de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("partida", { required: "La partida de nacimiento es obligatoria" })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.partida ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Número de partida"
                />
                {errors.partida && <p className="text-red-500 text-sm mt-1">{errors.partida.message}</p>}
              </div>
            </div>

            {/* DNI madre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DNI de la madre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dni_madre}
                readOnly
                className="w-full px-4 py-3 border-2 rounded-lg transition-colors border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Botón */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Registrar Hijo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
