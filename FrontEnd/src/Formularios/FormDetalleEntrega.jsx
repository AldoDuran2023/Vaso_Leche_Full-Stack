import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';

export default function FormularioEntrega() {
    const { id } = useParams(); // id_entrega
    const navigate = useNavigate();
    const [detalles, setDetalles] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [pending, setPending] = useState(true);

    const fetchDetalles = async () => {
        setPending(true);
        try {
            const res = await fetch(`http://localhost:5000/api/detalles_entregas/${id}`);
            const result = await res.json();
            if (result.success) {
                const procesado = result.data.map(d => ({
                    ...d,
                    estado: d.estado === "Entregado" ? 1 : 0,
                    cantidad_multas_pendientes: parseInt(d["cantidad_multas_pendientes "]) || 0
                }));
                setDetalles(procesado);
            } else {
                await Swal.fire({
                    title: "Error al cargar los datos",
                    text: result.message,
                    icon: "error"
                });
                navigate("/entregas");
            }
        } catch (err) {
            await Swal.fire({
                title: "Error de conexión",
                text: err.message,
                icon: "error"
            });
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        fetchDetalles();

        // Si viene desde tesorería
        const volver = sessionStorage.getItem("volver_a_entrega");
        if (volver === window.location.pathname) {
            sessionStorage.removeItem("volver_a_entrega");
            navigate(window.location.pathname, { replace: true });
            fetchDetalles();
        }
    }, [id, navigate]);

    const marcarEntregado = async (id_detalle) => {
        const { isConfirmed } = await Swal.fire({
            title: "¿Confirmar entrega?",
            text: "¿Desea marcar esta entrega como completada?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar"
        });

        if (!isConfirmed) return;

        try {
            const res = await fetch("http://localhost:5000/api/detalles_entregas/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_detalle, estado: 1 })
            });

            const result = await res.json();
            if (result.success) {
                await Swal.fire({
                    title: "¡Entregado!",
                    text: "Entrega marcada como completada correctamente.",
                    icon: "success"
                });

                setDetalles(prev =>
                    prev.map(d =>
                        d.id_detalle === id_detalle ? { ...d, estado: 1 } : d
                    )
                );
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error"
                });
            }
        } catch (err) {
            await Swal.fire({
                title: "Error al procesar la solicitud",
                text: err.message,
                icon: "error"
            });
        }
    };

    const finalizarEntrega = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "¿Finalizar entrega?",
            text: "No podrá realizar más cambios después.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, finalizar",
            cancelButtonText: "Cancelar"
        });

        if (!isConfirmed) return;

        setGuardando(true);
        try {
            const res = await fetch("http://localhost:5000/api/entregas/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_entrega: id, estado: 1 })
            });

            const result = await res.json();
            if (result.success) {
                await Swal.fire({
                    title: "Entrega finalizada",
                    text: "La entrega ha sido finalizada exitosamente.",
                    icon: "success"
                });
                setFinalizado(true);
                navigate("/entregas", { state: { recargar: true } });
            } else {
                await Swal.fire({
                    title: "Error al finalizar",
                    text: result.message,
                    icon: "error"
                });
            }
        } catch (err) {
            await Swal.fire({
                title: "Error de conexión",
                text: err.message,
                icon: "error"
            });
        } finally {
            setGuardando(false);
        }
    };

    // Calcular estadísticas
    const totalBeneficiarias = detalles.length;
    const entregasCompletas = detalles.filter(d => d.estado === 1).length;
    const entregasPendientes = totalBeneficiarias - entregasCompletas;
    const beneficiariasConDeudas = detalles.filter(d => d.cantidad_multas_pendientes > 0).length;
    const porcentajeCompletado = totalBeneficiarias > 0 ? Math.round((entregasCompletas / totalBeneficiarias) * 100) : 0;
    const totalRaciones = detalles.reduce((sum, d) => sum + parseInt(d.cantidad_raciones || 0), 0);

    const columns = [
        {
            name: "Nombre de la Beneficiaria",
            selector: row => row.beneficiaria,
            sortable: true,
            cell: row => (
                <div className="py-2">
                    <div className="font-medium text-gray-900">{row.beneficiaria}</div>
                    {row.cantidad_multas_pendientes > 0 && (
                        <div className="text-sm text-red-600 font-medium mt-1">
                            Tiene {row.cantidad_multas_pendientes} deuda(s) pendiente(s)
                        </div>
                    )}
                </div>
            ),
            grow: 2
        },
        {
            name: "Raciones",
            selector: row => row.cantidad_raciones,
            sortable: true,
            cell: row => (
                <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 rounded-md font-medium border border-blue-200">
                        {row.cantidad_raciones}
                    </span>
                </div>
            ),
            width: "120px"
        },
        {
            name: "Observaciones",
            selector: row => row.detalles,
            cell: row => (
                <div className="text-sm text-gray-600 py-2">
                    {row.detalles || "Sin observaciones"}
                </div>
            ),
            grow: 2
        },
        {
            name: "Estado / Acción",
            cell: row => (
                <div className="text-center py-2">
                    {row.estado === 1 ? (
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-800 rounded-md text-sm font-medium border border-green-200">
                            Entregado
                        </span>
                    ) : (
                        <button
                            onClick={async () => {
                                if (row.cantidad_multas_pendientes > 0) {
                                    const result = await Swal.fire({
                                        title: `⚠️ Deudas pendientes`,
                                        html: `
                                            La beneficiaria <b>"${row.beneficiaria}"</b> tiene <b>${row.cantidad_multas_pendientes}</b> multa(s) pendiente(s).<br><br>
                                            Debe realizar el pago antes de recibir la entrega.<br><br>
                                            ¿Desea ir a la sección de pagos?
                                        `,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Ir a pagar",
                                        cancelButtonText: "Cancelar"
                                    });

                                    if (result.isConfirmed) {
                                        sessionStorage.setItem("volver_a_entrega", window.location.pathname);
                                        navigate(`/tesoreria/pagar/${row.id_beneficiaria}`);
                                    }
                                } else {
                                    marcarEntregado(row.id_detalle);
                                }
                            }}
                            disabled={finalizado}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${row.cantidad_multas_pendientes > 0
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {row.cantidad_multas_pendientes > 0 ? "Ir a Pagar" : "Marcar Entregado"}
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (pending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">Cargando información de la entrega...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-6 px-4">
            {/* Encabezado */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Gestión de Entrega #{id}
                            </h1>
                            <p className="text-gray-600">
                                Administre las entregas a las madres beneficiarias
                            </p>
                        </div>
                        <button
                            onClick={finalizarEntrega}
                            disabled={guardando || finalizado}
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {guardando ? "Procesando..." : "Finalizar Entrega"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido principal en dos columnas */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna izquierda - Lista de beneficiarias */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-700 px-6 py-4">
                            <h2 className="text-lg font-semibold text-white">
                                Lista de Beneficiarias ({totalBeneficiarias})
                            </h2>
                            {beneficiariasConDeudas > 0 && (
                                <p className="text-blue-100 text-sm mt-1">
                                    {beneficiariasConDeudas} beneficiaria(s) con deudas pendientes
                                </p>
                            )}
                        </div>

                        <DataTable
                            columns={columns}
                            data={detalles}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5, 10, 15, 25]}
                            highlightOnHover
                            responsive
                            noDataComponent={
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                                        No hay registros disponibles
                                    </h3>
                                    <p className="text-gray-500">
                                        No se encontraron beneficiarias para esta entrega.
                                    </p>
                                </div>
                            }
                            paginationComponentOptions={{
                                rowsPerPageText: 'Registros por página:',
                                rangeSeparatorText: 'de',
                                selectAllRowsItem: true,
                                selectAllRowsItemText: 'Todos'
                            }}
                        />
                    </div>
                </div>

                {/* Columna derecha - Estadísticas e instrucciones */}
                <div className="space-y-6">

                    {/* Estadísticas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Entrega</h3>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-700">{totalBeneficiarias}</div>
                                <div className="text-sm text-blue-600">Total Beneficiarias</div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-700">{entregasCompletas}</div>
                                <div className="text-sm text-green-600">Entregadas</div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-orange-700">{entregasPendientes}</div>
                                <div className="text-sm text-orange-600">Pendientes</div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-red-700">{beneficiariasConDeudas}</div>
                                <div className="text-sm text-red-600">Con Deudas</div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-700">{totalRaciones}</div>
                                <div className="text-sm text-purple-600">Raciones Totales</div>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Progreso de entrega
                                </span>
                                <span className="text-sm text-gray-500">
                                    {porcentajeCompletado}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${porcentajeCompletado}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {entregasCompletas} de {totalBeneficiarias} completadas
                            </div>
                        </div>
                    </div>

                    {/* Instrucciones */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instrucciones</h3>

                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                    1
                                </div>
                                <p>Revise la lista de beneficiarias en el panel izquierdo.</p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                    2
                                </div>
                                <p>Si una beneficiaria tiene deudas, debe ir primero a "Pagos" antes de marcar la entrega.</p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                    3
                                </div>
                                <p>Use el botón "Marcar Entregado" cuando complete una entrega sin deudas.</p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                    4
                                </div>
                                <p>Una vez completadas todas las entregas, presione "Finalizar Entrega".</p>
                            </div>
                        </div>
                    </div>

                    {/* Alerta de deudas */}
                    {beneficiariasConDeudas > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                                    Atención
                                </h4>
                                <p className="text-sm text-yellow-700">
                                    Hay {beneficiariasConDeudas} beneficiaria(s) con deudas pendientes.
                                    Estas deben ser resueltas antes de realizar las entregas.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}