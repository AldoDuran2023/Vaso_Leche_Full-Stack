import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserPen, ContactRound, Bell, Box, Landmark, CircleDollarSign, ArrowRight
} from "lucide-react";
import Card from "../components/Card";

export default function Dashboard() {

    const [datos, setDatos] = useState(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fk_representante = usuario?.fk_representante;
    const nombres = usuario?.fullname;

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/dashboard/${fk_representante}`);
                const data = await res.json();
                setDatos(data);
            } catch (err) {
                console.error("Error al cargar dashboard:", err);
            }
        };

        if (fk_representante) {
            obtenerDatos();
        }
    }, [fk_representante]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition duration-500 hover:scale-[1.01]">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">¡Bienvenido de nuevo {nombres}!</h1>
                    <p className="text-lg text-gray-600">Aquí tienes un resumen rápido del estado actual de tu plataforma.</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Módulos Principales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card
                            modulo="Beneficiarias"
                            cantidad={datos?.beneficiarias_activas ?? 0}
                            url="/beneficiarias"
                            icon={<UserPen className="w-10 h-10 text-blue-500" />}
                            bgColor="bg-blue-50"
                            textColor="text-blue-700"
                        />
                        <Card
                            modulo="Representantes"
                            cantidad={datos?.representantes_activos ?? 0}
                            url="/representantes"
                            icon={<ContactRound className="w-10 h-10 text-green-500" />}
                            bgColor="bg-green-50"
                            textColor="text-green-700"
                        />
                        <Card
                            modulo="Balance Tesorería"
                            cantidad={`S/ ${datos?.balance_tesoreria?.toFixed(2) ?? "0.00"}`}
                            url="/tesoreria"
                            icon={<CircleDollarSign className="w-10 h-10 text-purple-500" />}
                            bgColor="bg-purple-50"
                            textColor="text-purple-700"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Otros Módulos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <Card
                            modulo="Reuniones"
                            cantidad={datos?.reuniones ?? 0}
                            url="/reuniones"
                            icon={<Bell className="w-10 h-10 text-yellow-500" />}
                            bgColor="bg-yellow-50"
                            textColor="text-yellow-700"
                            isSmall={true}
                        />
                        <Card
                            modulo="Reparticiones"
                            cantidad={datos?.reparticiones ?? 0}
                            url="/entregas"
                            icon={<Box className="w-10 h-10 text-teal-500" />}
                            bgColor="bg-teal-50"
                            textColor="text-teal-700"
                            isSmall={true}
                        />
                        <Card
                            modulo="Inventario"
                            // cantidad={totalInventarioItems}
                            cantidad={0}
                            url="/ingresos_viveres"
                            icon={<Landmark className="w-10 h-10 text-indigo-500" />}
                            bgColor="bg-indigo-50"
                            textColor="text-indigo-700"
                            isSmall={true}
                        />
                        <Card
                            modulo="Gastos Registrados"
                            cantidad={`S/ ${datos?.gastos?.toFixed(2) ?? "0.00"}`}
                            url="/gastos"
                            icon={<ArrowRight className="w-10 h-10 text-red-500" />}
                            bgColor="bg-red-50"
                            textColor="text-red-700"
                            isSmall={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}