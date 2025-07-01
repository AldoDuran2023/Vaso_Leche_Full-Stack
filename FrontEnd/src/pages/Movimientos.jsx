import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function Movimientos() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pending, setPending] = useState(true);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const fetchAllData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/multas/");
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("Error al obtener las multas:", result.message);
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

    useEffect(() => {
        const filtered = data.filter(item => {
            const text = searchText.toLowerCase();
            return (
                item.beneficiaria.toLowerCase().includes(text) ||
                item.tipo.toLowerCase().includes(text) ||
                item.monto.toString().toLowerCase().includes(text) ||
                item.descripcion.toLowerCase().includes(text)
            );
        });
        setFilteredData(filtered);
    }, [searchText, data]);

    const handlePagarClick = (row) => {
        navigate(`/tesoreria/pagar/${row.id_beneficiaria}`);
    };

    const columns = [
        {
            name: "Beneficiaria",
            selector: row => row.beneficiaria,
            sortable: true
        },
        {
            name: "Tipo multa",
            selector: row => row.tipo,
            sortable: true
        },
        {
            name: "Monto",
            selector: row => `S/ ${parseFloat(row.monto).toFixed(2)}`,
            sortable: true
        },
        {
            name: "Detalles de la multa",
            selector: row => row.descripcion
        },
        {
            name: "Acciones",
            cell: row => (
                <div className="flex gap-2">
                    {row.fecha_pago == null && (
                        <button
                            onClick={() => handlePagarClick(row)}
                            className="cursor-pointer transition-all bg-blue-500 text-white px-4 py-2 rounded-lg border-blue-600
                    border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                            title="Pagar multa"
                        >
                            Pagar
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Lista de Multas No Canceladas</h2>

            <p className="text-gray-700 text-sm mb-4">
                A continuación se muestra el listado de las multas pendientes registradas en el sistema.
                Puedes utilizar la barra de búsqueda para encontrar una multa por beneficiaria, tipo, monto o descripción.
                Haz clic en "Pagar" para procesar el pago de la multa correspondiente.
            </p>

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
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                progressPending={pending}
                pagination
                highlightOnHover
                responsive
                noDataComponent="No hay multas registradas"
            />
        </div>
    );
}
