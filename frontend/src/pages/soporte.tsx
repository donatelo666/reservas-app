import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/authcontext";

export interface Mensaje {
  id: number;
  asunto: string;
  mensaje: string; // corregido
}

function SoporteForm() {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({ asunto: "", mensaje: "" });

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
  );
}

export default SoporteForm;
