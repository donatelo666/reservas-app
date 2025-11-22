import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import EditReservaModal from "../components/edit-modal";
import ConfirmModal from "../components/confirm-modal";

interface Reserva {
  id: number;
  usuario_id: number;
  servicio_id: number;
  servicio_nombre: string;
  fecha: string;
  hora: string;
  estado?: "pendiente" | "confirmada" | "cancelada";
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

function Reservas() {
  const { user, token } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<Reserva>({
    usuario_id: user?.id || 0,
    servicio_id: 0,
    fecha: "",
    hora: "",
    estado: "pendiente",
    servicio_nombre: "",
    id: 0,
  });
  const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
  const [reservaAEliminar, setReservaAEliminar] = useState<Reserva | null>(
    null
  );

  // Obtener reservas del usuario
  const fetchReservas = async () => {
    if (!user?.id || !token) return; // 👈 evita llamar con undefined
    try {
      const res = await axios.get(
        `http://localhost:4000/api/reservas/usuario/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservas(res.data);
    } catch (error) {
      console.error("Error al obtener reservas", error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [user, token]);

  // Obtener servicios disponibles
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/servicios");
        setServicios(res.data);
      } catch (error) {
        console.error("Error al obtener servicios", error);
      }
    };
    fetchServicios();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "servicio_id" ? Number(value) : value,
    });
  };

  // Crear nueva reserva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) {
      alert("Debes iniciar sesión para crear una reserva");
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/api/reservas",
        { ...formData, usuario_id: user.id }, // 👈 asegura que se use el id correcto
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Reserva creada con éxito");
      setFormData({
        usuario_id: user.id,
        servicio_id: 0,
        fecha: "",
        hora: "",
        estado: "pendiente",
        servicio_nombre: "",
        id: 0,
      });
      fetchReservas();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al crear reserva");
    }
  };

  const editarReserva = async (id: number, fecha: string, hora: string) => {
    try {
      await axios.put(
        `http://localhost:4000/api/reservas/actualizar/${id}`,
        { fecha, hora },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reserva editada");
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, fecha, hora } : r))
      );
    } catch (error) {
      console.error("Error al editar reserva", error);
    }
  };

  const eliminarReserva = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/reservas/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reserva eliminada");
      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error al eliminar reserva", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mis Reservas</h2>

      {/* Formulario de creacion*/}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label>
          Servicio:
          <select
            name="servicio_id"
            value={formData.servicio_id}
            onChange={handleChange}
            required
          >
            <option value={0}>Seleccione un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre} - ${servicio.precio} ({servicio.duracion} min)
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Hora:
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <button type="submit">Crear Reserva</button>
      </form>

      {/* Listado de reservas */}
      <h3>Reservas existentes</h3>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            Servicio: {reserva.servicio_nombre} | Fecha: {reserva.fecha} | Hora:{" "}
            {reserva.hora} | Estado: {reserva.estado}{" "}
            <button onClick={() => setReservaEditando(reserva)}>
              ✏️ Editar
            </button>
            <button onClick={() => setReservaAEliminar(reserva)}>
              🗑️ Eliminar
            </button>
          </li>
        ))}
      </ul>

      {reservaEditando && (
        <EditReservaModal
          reservaId={reservaEditando.id}
          fechaActual={reservaEditando.fecha}
          horaActual={reservaEditando.hora}
          onClose={() => setReservaEditando(null)}
          onSave={editarReserva}
        />
      )}

      {reservaAEliminar && (
        <ConfirmModal
          message="¿Seguro que quieres eliminar esta reserva?"
          onConfirm={() => {
            eliminarReserva(reservaAEliminar.id);
            setReservaAEliminar(null);
          }}
          onCancel={() => setReservaAEliminar(null)}
        />
      )}
    </div>
  );
}

export default Reservas;
