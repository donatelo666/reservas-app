import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"cliente" | "admin">("cliente");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/usuarios/registro", {
        nombre,
        email,
        password,
        rol,
      });
      toast.success("Usuario registrado con exito");
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("cliente");
      navigate("/login");
    } catch (error) {
      toast.error("❌ Error al registrar usuario");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
        </label>
        <br />

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-mail"
          />
        </label>
        <br />

        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        <br />

        <label>
          Rol:
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as "cliente" | "admin")}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
