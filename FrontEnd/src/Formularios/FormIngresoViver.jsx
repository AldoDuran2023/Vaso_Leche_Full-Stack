import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FormIngresoUnico() {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const [viveres, setViveres] = useState([]);
    const [detallesViveres, setDetallesViveres] = useState([]);
    const [loading, setLoading] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const juntaUsuario = usuario?.fk_junta;

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respViveres = await fetch('http://localhost:5000/api/inventarios/');
                const dataViveres = await respViveres.json();
                if (dataViveres.success) {
                    setViveres(dataViveres.data);
                }
                if (juntaUsuario) {
                    setValue("fk_junta_directiva", String(juntaUsuario));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setLoading(false);
            }
        };

        cargarDatos();
    }, [juntaUsuario, setValue]);

    const agregarDetalle = (data) => {
        const viver = viveres.find(v => v.id_viver === parseInt(data.fk_viver));
        if (!viver) return;

        const nuevoDetalle = {
            fk_viver: parseInt(data.fk_viver),
            nombre: viver.nombre_viver,
            cantidad: parseFloat(data.detalle_cantidad),
            unidad: viver.tipo_unidad
        };

        setDetallesViveres(prev => [...prev, nuevoDetalle]);
        setValue("detalle_cantidad", "");
        setValue("fk_viver", "");
    };

    const agruparDetalles = () => {
        const mapa = new Map();
        for (const d of detallesViveres) {
            if (mapa.has(d.fk_viver)) {
                mapa.get(d.fk_viver).cantidad += d.cantidad;
            } else {
                mapa.set(d.fk_viver, { ...d });
            }
        }
        return Array.from(mapa.values());
    };

    const onSubmit = async (data) => {
        if (detallesViveres.length === 0) {
            await Swal.fire({
                title: "Atención",
                text: "Agrega al menos un detalle de víveres",
                icon: "warning"
            });
            return;
        }

        try {
            const resIngreso = await fetch("http://localhost:5000/api/detalle_ingreso/ingreso/nuevo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fecha_ingreso: data.fecha_ingreso,
                    responsable: data.responsable,
                    fk_junta_directiva: data.fk_junta_directiva
                })
            });

            const ingreso = await resIngreso.json();

            if (!ingreso.success) {
                await Swal.fire({
                    title: "Error",
                    text: "Error al crear ingreso: " + ingreso.message,
                    icon: "error"
                });
                return;
            }

            for (const detalle of detallesViveres) {
                await fetch("http://localhost:5000/api/detalle_ingreso/nuevo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fk_ingreso: ingreso.id_ingreso,
                        fk_viver: detalle.fk_viver,
                        cantidad: detalle.cantidad
                    })
                });
            }

            await Swal.fire({
                title: "Ingresos Registrado correctamente",
                text: "Ingreso y detalles registrados con éxito.",
                icon: "success"
            });
            window.history.back();
        } catch (err) {
            await Swal.fire({
                title: "Error al registrar los ingresos",
                text: err.message,
                icon: "error"
            });
        }
    };

    if (loading) return <p className="text-center py-6">Cargando datos...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Detalle de Inventario</h1>
                <p className="text-gray-600 text-lg">Registre el ingreso de víveres</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Fecha de Ingreso</label>
                        <input type="date" {...register("fecha_ingreso", { required: true })}
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        {errors.fecha_ingreso && <p className="text-red-500 text-sm">Este campo es requerido</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Responsable</label>
                        <input type="text" {...register("responsable", { required: true })}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" />
                        {errors.responsable && <p className="text-red-500 text-sm">Este campo es requerido</p>}
                    </div>
                </div>

                <input type="hidden" {...register("fk_junta_directiva", { required: true })} value={juntaUsuario} />

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Agregar Detalle de Víveres</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Víveres</label>
                            <select {...register("fk_viver")}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">Seleccione</option>
                                {viveres.map(v => (
                                    <option key={v.id_viver} value={v.id_viver}>
                                        {v.nombre_viver} ({v.tipo_unidad})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Cantidad</label>
                            <input type="number" step="0.01" {...register("detalle_cantidad")}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>
                    </div>
                    <button type="button" onClick={handleSubmit(agregarDetalle)} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Agregar a la lista
                    </button>

                    {detallesViveres.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-md font-semibold mb-2">Resumen de ingreso:</h4>
                                <p><strong>Fecha:</strong> {watch("fecha_ingreso")}</p>
                                <p><strong>Responsable:</strong> {watch("responsable")}</p>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold mb-2">Detalles de víveres:</h4>
                                <table className="w-full border border-gray-300 rounded text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 border">Vívere</th>
                                            <th className="p-2 border">Cantidad</th>
                                            <th className="p-2 border">Unidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agruparDetalles().map((d, i) => (
                                            <tr key={i} className="text-center">
                                                <td className="p-2 border">{d.nombre}</td>
                                                <td className="p-2 border">{d.cantidad}</td>
                                                <td className="p-2 border">{d.unidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
                        Registrar Ingreso y Detalles
                    </button>
                </div>
            </form>
        </div>
    );
}
