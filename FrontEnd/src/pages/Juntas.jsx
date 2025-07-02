import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';

export default function Juntas() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");

    // solo se puede insertar la junta en el mes de diciembre
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const fetchAllData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/juntas/");
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener las juntas:", result.message);
            }
        } catch (error) {
            console.error("Error de red:", error);
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        if (currentMonth === 11) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, []);

    // Función para filtrar datos por nombre, dni
    useEffect(() => {
        const filtered = data.filter(item => {
            const text = searchText.toLowerCase();
            return (
                item.nombre.toLowerCase().includes(text) ||
                item.fecha_inicio.toLowerCase().includes(text) ||
                item.fecha_fin.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    const columns = [
        {
            name: "Nombre Junta Directiva",
            selector: row => row.nombre,
            sortable: true
        },
        {
            name: "Fecha de Inicio",
            selector: row => new Date(row.fecha_inicio).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
            sortable: true
        },
        {
            name: "Fecha de Finalización",
            selector: row => new Date(row.fecha_fin).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
        },
        {
            name: "Estado",
            cell: row => {
                const estadoValue = row.estado; // It will be 0 or 1

                if (estadoValue === 1) {
                    return (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Activo
                        </span>
                    );
                } else if (estadoValue === 0) {
                    return (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Inactivo
                        </span>
                    );
                }
                // Fallback for any other unexpected value
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Desconocido
                    </span>
                );
            },
            selector: row => row.estado,
        }
    ];

    return (
        <div className="p-4">
            {/* Título principal */}
            <h2 className="text-xl font-bold mb-2">Lista de Juntas Directivas</h2>

            {/* Descripción breve */}
            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de las juntas directivas registrados en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una reunion por nombre o fechas
                y consultar o gestionar su información en la tabla.
            </p>

            {/* Barra de búsqueda y botón */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="px-4 py-2 border border-gray-300 rounded-xl w-full md:w-1/3 bg-white shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-400 transition-all duration-300 ease-in-out
                        hover:scale-[1.01] hover:shadow-md"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    onClick={(e) => {
                        e.preventDefault();
                        if (isButtonDisabled) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Acción no permitida',
                                text: 'Solo se puede crear una nueva Junta Directiva en el mes de diciembre.',
                                confirmButtonText: 'Entendido',
                                confirmButtonColor: '#2563eb'
                            });
                        } else {
                            window.location.href = '/juntas/nuevo';
                        }
                    }}
                    title={isButtonDisabled ? 'Solo se puede crear una nueva Junta Directiva en diciembre.' : ''}
                >
                    Nueva Junta Directiva
                </button>
            </div>

            {/* Tabla de datos */}
            <DataTable
                columns={columns}
                data={filteredData}
                progressPending={pending}
                pagination
                highlightOnHover
                responsive
                noDataComponent="No hay juntas directivas registradas"
            />
        </div>
    );
}
