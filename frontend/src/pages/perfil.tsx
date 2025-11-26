import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { toast } from "react-toastify";
import "../styles/perfil.css";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
  password: string;
  oldPassword: string;
  newPassword: string;
}

function Perfil() {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: user?.nombre,
    email: user?.email,
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/usuarios/perfil/${user?.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Perfil editado con éxito");
    } catch (error) {
      toast.error("❌ Error al editar usuario");
      console.error("Error al editar", error);
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Contraseña actual:
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
          />
        </label>
        <label>
          Nueva contraseña:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}

export default Perfil;
