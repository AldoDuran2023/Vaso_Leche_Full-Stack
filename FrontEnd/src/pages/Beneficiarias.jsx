import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from 'react-router-dom';
import { FileInput } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Beneficiarias() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");

    const fetchAllData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/beneficiarias/");
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener beneficiarias:", result.message);
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

    // Función para filtrar datos por nombre, dni o dirección
    useEffect(() => {
        const filtered = data.filter(item => {
            const text = searchText.toLowerCase();
            return (
                item.dni.toLowerCase().includes(text) ||
                item.nombres_completos.toLowerCase().includes(text) ||
                item.direccion.toLowerCase().includes(text) ||
                item.telefono.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    // Función para ver a los hijos con SweetAlert2
    const verHijos = async (id_beneficiaria) => {
        try {
            // Mostrar loading
            Swal.fire({
                title: 'Cargando...',
                text: 'Obteniendo información de los hijos',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`http://localhost:5000/api/hijos/${id_beneficiaria}`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                // Crear tabla HTML con estilo Tailwind
                const tableHTML = `
                <div class="max-h-[400px] rounded-lg shadow-md overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    DNI
                                </th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombres
                                </th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Edad
                                </th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Partida
                                </th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${result.data.map((hijo, index) => `
                                <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100">
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${hijo.DNI || '-'}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${hijo.nombres || '-'}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${hijo.edad !== null && hijo.edad !== undefined ? hijo.edad : '-'}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${hijo.partida || '-'}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        ${hijo.estado ?
                        '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>' :
                        '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactivo</span>'
                    }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

                Swal.fire({
                    title: "Hijos de la Beneficiaria",
                    html: tableHTML,
                    width: "900px", // Aumentamos el ancho para que quepan todas las columnas sin scroll
                    confirmButtonText: "Cerrar",
                    customClass: {
                        popup: 'swal2-tailwind-popup',
                        title: 'swal2-tailwind-title',
                        htmlContainer: 'swal2-tailwind-html-container',
                        confirmButton: 'swal2-tailwind-confirm-button'
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin hijos registrados',
                    text: 'Esta beneficiaria no tiene hijos registrados en el sistema.',
                    confirmButtonColor: '#3b82f6',
                    customClass: {
                        popup: 'swal2-tailwind-popup',
                        title: 'swal2-tailwind-title',
                        confirmButton: 'swal2-tailwind-confirm-button'
                    }
                });
            }
        } catch (error) {
            console.error("Error al obtener hijos:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al obtener la información de los hijos.',
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: 'swal2-tailwind-popup',
                    title: 'swal2-tailwind-title',
                    confirmButton: 'swal2-tailwind-confirm-button'
                }
            });
        }
    };

    const columns = [
        {
            name: "DNI",
            selector: row => row.dni,
            sortable: true,
        },
        {
            name: "Nombres completos",
            selector: row => row.nombres_completos,
            sortable: true,
            wrap: true
        },
        {
            name: "Tipo",
            selector: row => row.tipo,
            sortable: true
        },
        {
            name: "Hijos",
            cell: row => (
                <button
                    onClick={() => verHijos(row.id_beneficiaria)}
                    className="bg-indigo-500 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm shadow-md transition-all"
                >
                    Ver Hijos
                </button>
            )
        },
        {
            name: "Teléfono",
            selector: row => row.telefono
        },
        {
            name: "Raciones",
            selector: row => row.raciones,
            sortable: true,
        },
        {
            name: "Estado",
            cell: row => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.estado === true || row.estado === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.estado === true || row.estado === 1 ? "Activo" : "Inactivo"}
                </span>
            )
        },
        {
            name: "Acciones",
            cell: row => (
                <div className="flex flex-wrap gap-2 items-center justify-center w-full">
                    <button
                        onClick={() => navigate(`/beneficiarias/editar/${row.id_beneficiaria}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => navigate(`/hijos/nuevo/${row.dni}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    >
                        + Hijo
                    </button>
                </div>
            ),
            wrap: true
        }
    ];

    return (
        <div className="p-4">
            {/* Título principal */}
            <h2 className="text-xl font-bold mb-2">Lista de Beneficiarias</h2>

            {/* Descripción breve */}
            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de beneficiarias registradas en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una persona por nombre, DNI o dirección,
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
                    onClick={() => window.location.href = '/beneficiarias/nuevo'}
                >
                    Añadir Nueva Beneficiaria
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <a
                    href="http://localhost:5000/api/beneficiarias/reporte/beneficiarias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-center flex items-center gap-2"
                >
                    <FileInput />
                    Exportar Datos
                </a>
            </div>

            {/* Tabla de datos */}
            <div className="overflow-x-auto w-full">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={pending}
                    pagination
                    highlightOnHover
                    responsive
                    noDataComponent="No hay beneficiarias registradas"
                />
            </div>
        </div>
    );
}