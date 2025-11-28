import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { toast } from "react-toastify";
import ResponderSoporteModal from "../components/responder-soporte";

interface Mensaje {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  asunto: string;
  mensaje: string;
  created_at: string;
  estado: "pendiente" | "respondido";
  respuesta_admin: string;
}

function Mensajes() {
  const { token, user } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [respuestaEnviando, setRespuestaEnviando] = useState<Mensaje | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // vacio = todos

  const mensajesFiltrados = mensajes.filter((m) => {
    const coincideTexto =
      m.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.created_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.usuario_id.toString().includes(searchTerm) ||
      m.id.toString().includes(searchTerm);

    const coincideEstado = estadoFiltro ? m.estado === estadoFiltro : true;

    return coincideTexto && coincideEstado;
  });

  useEffect(() => {
    const fetchMensajes = async () => {
      if (!token || user?.rol !== "admin") return;
      try {
        const res = await axios.get(
          "http://localhost:4000/api/admin/mensajes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMensajes(res.data);
      } catch (error) {
        console.error("Error al obtener mensajes", error);
      }
    };
    fetchMensajes();
  }, [token, user]);

  const responderSoporte = async (id: number, respuesta: string) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/mensaje-respuesta/${id}`,
        { respuesta, estado: "respondido" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Respuesta enviada con exito");
      setMensajes((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, respuesta_admin: respuesta, estado: "respondido" }
            : m
        )
      );
    } catch (error) {
      toast.error("Error en respuesta");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="titulos">Tabla mensajes</h2>
      <h2 className="titulos">Buscador</h2>

      <div className="buscador-container">
        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre , asunto , mensaje o id  ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="respondido">Respondido</option>
        </select>
      </div>

      {user?.rol !== "admin" ? (
        <p>No tienes acceso a esta sección</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Asunto</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Creado en</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajesFiltrados.map((mensaje) => (
              <tr key={mensaje.id}>
                <td>{mensaje.id}</td>
                <td>{mensaje.usuario_nombre}</td>
                <td>{mensaje.asunto}</td>
                <td>{mensaje.mensaje}</td>
                <td>{mensaje.estado}</td>
                <td>{mensaje.created_at}</td>
                <td>{mensaje.respuesta_admin}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => setRespuestaEnviando(mensaje)}
                  >
                    Responder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {respuestaEnviando && (
        <ResponderSoporteModal
          mensajeId={respuestaEnviando.id}
          respuestaActual={respuestaEnviando.respuesta_admin}
          onClose={() => setRespuestaEnviando(null)}
          onSave={responderSoporte}
        />
      )}
    </div>
  );
}

export default Mensajes;
