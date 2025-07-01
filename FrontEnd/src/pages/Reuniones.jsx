import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2'

export default function Reuniones() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");

    const fetchAllData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/reuniones/");
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener las reuniones:", result.message);
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

    // Función para obtener los detalles de una asistencia
    const fetchAsistencias = async (id_reunion) => {
        try {
            const response = await fetch(`http://localhost:5000/api/asistencias/${id_reunion}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener asistencias:", error);
            return { success: false, message: "Error al conectar con el servidor" };
        }
    };

    // Función para ver los detalles con sweetalert
    const mostrarDetalles = async (id_reunion) => {
        const res = await fetchAsistencias(id_reunion);

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
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${lista.map((asistencia, index) => `
                        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${index + 1}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${asistencia.beneficiaria}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                ${asistencia.estado === 'Presente' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Presente</span>' :
                asistencia.estado === 'Ausente' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ausente</span>' :
                    asistencia.estado === 'Tarde' ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Tarde</span>' :
                        `<span class="text-gray-900">${asistencia.estado}</span>`
            }
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

        Swal.fire({
            title: "Detalles de Asistencia",
            html: tablaHTML,
            width: "650px",
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
                item.fecha_hora.toLowerCase().includes(text) ||
                item.lugar.toLowerCase().includes(text) ||
                item.motivo.toLowerCase().includes(text) ||
                item.junta.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    const columns = [
        {
            name: "Fecha y Hora",
            selector: row => new Date(row.fecha_hora).toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }),
            sortable: true
        },
        {
            name: "Lugar",
            selector: row => row.lugar,
            sortable: true
        },
        {
            name: "Motivo",
            selector: row => row.motivo
        },
        {
            name: "Junta Directiva",
            selector: row => row.junta
        },
        {
            name: "Estado",
            cell: row => {
                const esFinalizado = row.estado === true || row.estado === "Realizada";
                return esFinalizado ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Finalizado
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-gray-700">
                        Pendiente
                    </span>
                );
            }
        },
        {
            name: "Acciones",
            cell: row => {
                const esFinalizado = row.estado === true || row.estado === "Realizada";
                return esFinalizado ? (
                    <span
                        onClick={() => mostrarDetalles(row.id_reunion)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        Ver Detalles
                    </span>
                ) : (
                    <button
                        onClick={() => window.location.href = `/asistencia/${row.id_reunion}`}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        Pasar Lista
                    </button>
                );
            }
        }
    ];

    return (
        <div className="p-4">
            {/* Título principal */}
            <h2 className="text-xl font-bold mb-2">Lista de Reuniones</h2>

            {/* Descripción breve */}
            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de las reuniones registradas en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una reunion por fecha, motivo, lugar o junta directiva,
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
                    onClick={() => window.location.href = '/reuniones/nuevo'}
                >
                    Añadir Nueva Reunión
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
                noDataComponent="No hay reuniones registradas"
            />
        </div>
    );
}
