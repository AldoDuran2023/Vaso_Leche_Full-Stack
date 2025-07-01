import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./layouts/Dashboard";
import Beneficiarias from "./pages/Beneficiarias";
import FormBeneficiaria from "./Formularios/FormBeneficiaria";
import Representantes from "./pages/Representantes";
import Reuniones from "./pages/Reuniones";
import Entregas from "./pages/Entregas";
import Inventarios from "./pages/Inventario";
import Movimientos from "./pages/Movimientos";
import Gastos from "./pages/Gastos";
import FormRepresentante from "./Formularios/FormRepresentante";
import FormReunion from "./Formularios/FormReunion";
import FormEntrega from "./Formularios/FormEntrega";
import FormDetalleInventario from "./Formularios/FormIngresoViver";
import FormPagoMultas from "./Formularios/FormPAgos";
import FormGasto from "./Formularios/FormGasto";
import FormularioAsistencia from "./Formularios/FormAsistencia";
import FormularioEntrega from "./Formularios/FormDetalleEntrega";
import FormularioUsuario from "./Formularios/FormUsuario";
import Login from "./layouts/Login";
import PrivateRoute from "./components/PrivateRoute";
import FormHijo from "./Formularios/FormHijo";
import FormJunta from "./Formularios/FormJuntas";
import Juntas from "./pages/Juntas";

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beneficiarias" element={<Beneficiarias />} />
          <Route path="/beneficiarias/nuevo" element={<FormBeneficiaria />} />
          <Route path="/beneficiarias/editar/:id" element={<FormBeneficiaria />} />
          <Route path="/hijos/nuevo/:dni_madre" element={<FormHijo />} />
          <Route path="/representantes" element={<Representantes />} />
          <Route path="/representantes/nuevo" element={<FormRepresentante />} />
          <Route path="/reuniones" element={<Reuniones />} />
          <Route path="/reuniones/nuevo" element={<FormReunion />} />
          <Route path="/entregas" element={<Entregas />} />
          <Route path="/entregas/nuevo" element={<FormEntrega />} />
          <Route path="/ingresos_viveres" element={<Inventarios />} />
          <Route path="/ingresos_viveres/nuevo" element={<FormDetalleInventario />} />
          <Route path="/tesoreria" element={<Movimientos />} />
          <Route path="/tesoreria/pagar/:id" element={<FormPagoMultas />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/gastos/nuevo" element={<FormGasto />} />
          <Route path="/asistencia/:id" element={<FormularioAsistencia />} />
          <Route path="/entregas/:id" element={<FormularioEntrega />} />
          <Route path="/usuarios" element={<FormularioUsuario />} />
          <Route path="/usuarios/editar/:id" element={<FormularioUsuario />} />
          <Route path="/juntas/nuevo" element={<FormJunta />} />
          <Route path="/juntas" element={<Juntas />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
