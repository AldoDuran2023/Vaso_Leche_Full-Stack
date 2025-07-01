import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";

export default function Gastos() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const fk_representante = usuario?.fk_junta;

    const fetchAllData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/gastos/?id_representante=${fk_representante}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener los gastos:", result.message);
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

    // Función para filtrar datos por nombre, dni
    useEffect(() => {
        const filtered = data.filter(item => {
            const text = searchText.toLowerCase();
            return (
                item.nombres.toLowerCase().includes(text) ||
                item.motivo.toLowerCase().includes(text) ||
                item.fecha.toLowerCase().includes(text) ||
                item.monto.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    const columns = [
        {
            name: "Responsable",
            selector: row => row.nombres,
            sortable: true
        },
        {
            name: "Motivo del gasto",
            selector: row => row.motivo,
            sortable: true
        },
        {
            name: "Fecha",
            selector: row => new Date(row.fecha).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
        },
        {
            name: "Monto desenbolsado",
            selector: row => row.monto
        }
    ];

    return (
        <div className="p-4">
            {/* Título principal */}
            <h2 className="text-xl font-bold mb-2">Lista de Gastos</h2>

            {/* Descripción breve */}
            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de los gastos registradas en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una reunion por fecha, motivo o Responsable,
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
                    onClick={() => window.location.href = '/gastos/nuevo'}
                >
                    Añadir Nuevo Gasto
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
