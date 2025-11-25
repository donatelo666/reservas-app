import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { toast } from "react-toastify";

interface Reserva {
  id: number;
  usuario_id: number;
  servicio_id: number;
  usuario_nombre: string;
  servicio_nombre: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "cancelada";
}

function AdminPanel() {
  const { token, user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // vacio = todos

  const reservasFiltradas = reservas.filter((r) => {
    const coincideTexto =
      r.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.servicio_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toString().includes(searchTerm);

    const coincideEstado = estadoFiltro ? r.estado === estadoFiltro : true;

    return coincideTexto && coincideEstado;
  });

  useEffect(() => {
    const fetchReservas = async () => {
      if (!token || user?.rol !== "admin") return;
      try {
        const res = await axios.get("http://localhost:4000/api/reservas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservas(res.data);
      } catch (error) {
        console.error("Error al obtener reservas", error);
      }
    };
    fetchReservas();
  }, [token, user]);

  const confirmarReserva = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/reservas/${id}/confirmar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva confirmada");
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "confirmada" } : r))
      );
    } catch (error) {
      toast.error("❌ Error confirmando");
      console.error("Error al confirmar reserva", error);
    }
  };

  const cancelarReserva = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/reservas/${id}/cancelar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva cancelada");

      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r))
      );
    } catch (error) {
      toast.error("❌ Error cancelando");
      console.error("Error al cancelar reserva", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="titulos">Tabla reservas</h2>
      <h2 className="titulos">Buscador</h2>

      <div className="buscador-container">
        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre, servicio, fecha o  id ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      {user?.rol !== "admin" ? (
        <p>No tienes acceso a esta sección</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.usuario_nombre}</td>
                <td>{reserva.servicio_nombre}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.estado}</td>
                <td>
                  <button onClick={() => confirmarReserva(reserva.id)}>
                    Confirmar
                  </button>
                  <button onClick={() => cancelarReserva(reserva.id)}>
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
