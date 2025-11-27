import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/authcontext";
import "../styles/soporte.css";

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

function SoporteForm() {
  const { user, token } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  const [formData, setFormData] = useState({ asunto: "", mensaje: "" });

  // Obtener mensajes del usuario
  const fetchMensajes = async () => {
    if (!user?.id || !token) return; // 👈 evita llamar con undefined
    try {
      const res = await axios.get(
        `http://localhost:4000/api/usuarios/mensajes/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al obtener mensajes", error);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, [user, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Usuario no válido");
      return;
    }

    try {
      await axios.post(
        `http://localhost:4000/api/usuarios/mensaje/${user.id}`,
        {
          asunto: formData.asunto,
          mensaje: formData.mensaje,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Mensaje enviado al soporte");
      setFormData({ asunto: "", mensaje: "" });
    } catch {
      toast.error("Error enviando mensaje");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Asunto:
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mensaje:
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>

      {mensajes.map((m) => (
        <div key={m.id} className="mensaje-card">
          <p>
            <strong>Asunto:</strong> {m.asunto}
          </p>
          <p>
            <strong>Tu mensaje:</strong> {m.mensaje}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={
                m.estado === "respondido"
                  ? "estado-respondido"
                  : "estado-pendiente"
              }
            >
              {m.estado}
            </span>
          </p>

          {m.estado === "respondido" && (
            <div className="respuesta-admin">
              <p>
                <strong>Respuesta del administrador:</strong>
              </p>
              <p>{m.respuesta_admin ?? "Sin respuesta aún"}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SoporteForm;
