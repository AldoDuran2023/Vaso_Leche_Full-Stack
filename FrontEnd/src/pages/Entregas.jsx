import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2'

export default function Entregas() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fk_representante = usuario?.fk_junta;

    const fetchAllData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/entregas?id_representante=${fk_representante}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener las entregas:", result.message);
            }
        } catch (error) {
            console.error("Error de red:", error);
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Función para traer los detalles:
    const fetchDetalleEntrega = async (id_entrega) => {
        try {
            const response = await fetch(`http://localhost:5000/api/detalles_entregas/${id_entrega}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener detalles de entrega:", error);
            return { success: false, message: "Error al conectar con el servidor" };
        }
    };

    // mostrar los detalles con sweetalert
    const mostrarDetallesEntrega = async (id_entrega) => {
        const res = await fetchDetalleEntrega(id_entrega);

        if (!res.success) {
            Swal.fire("Error", res.message, "error");
            return;
        }

        const lista = res.data;

        const tablaHTML = `
            <div class="overflow-x-auto max-h-[400px] rounded-lg shadow-md">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Beneficiaria
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Raciones
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Multas
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Detalles
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${lista.map((item, index) => `
                            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${index + 1}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${item.beneficiaria}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${item.cantidad_raciones}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    ${item.estado === 'Entregado' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>' :
                item.estado === 'Pendiente' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>' :
                    item.estado === 'Rechazado' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rechazado</span>' :
                        `<span class="text-gray-900">${item.estado}</span>`
            }
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm ${item.cantidad_multas_pendientes > 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}">
                                    ${item.cantidad_multas_pendientes || 0}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500">
                                    ${item.detalles || '-'}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

        Swal.fire({
            title: "Detalles de Entrega",
            html: tablaHTML,
            width: "850px", // Increased width to accommodate more columns
            confirmButtonText: "Cerrar",
            customClass: {
                popup: 'swal2-tailwind-popup',
                title: 'swal2-tailwind-title',
                htmlContainer: 'swal2-tailwind-html-container',
                confirmButton: 'swal2-tailwind-confirm-button'
            }
        });
    };

    // Función para filtrar datos por nombre, dni
    useEffect(() => {
        const filtered = data.filter(item => {
            const text = searchText.toLowerCase();
            return (
                item.representante.toLowerCase().includes(text) ||
                item.fecha_entrega.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    const columns = [
        {
            name: "Representante",
            selector: row => row.representante,
            sortable: true
        },
        {
            name: "Fecha de Entrega",
            selector: row => new Date(row.fecha_entrega).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
            sortable: true
        },
        {
            name: "Estado",
            cell: row => (
                row.estado === true || row.estado === "Entregado" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Finalizado
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Pendiente
                    </span>
                )
            )
        },
        {
            name: "Acciones",
            cell: row => (
                row.estado === true || row.estado === "Entregado" ? (
                    <span
                        onClick={() => mostrarDetallesEntrega(row.id_entrega)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        Ver Detalles
                    </span>
                ) : (
                    <button
                        onClick={() => window.location.href = `/entregas/${row.id_entrega}`}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        Realizar Entrega
                    </button>
                )
            )
        }
    ];

    return (
        <div className="p-4">
            {/* Título principal */}
            <h2 className="text-xl font-bold mb-2">Lista de Entregas</h2>

            {/* Descripción breve */}
            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de las entregas registradas en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una reunion por fecha o representante y consultar o gestionar su información en la tabla.
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
                    onClick={() => window.location.href = '/entregas/nuevo'}
                >
                    Añadir Nueva Entrega
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
                noDataComponent="No hay entregas registradas"
            />
        </div>
    );
}
