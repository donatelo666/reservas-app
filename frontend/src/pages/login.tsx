import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/usuarios/login", {
        email,
        password,
      });

      if (!res.data.token) {
        alert("Login fallido: token no recibido");
        return;
      }

      // Guardar usuario y token en contexto
      login(
        {
          id: res.data.id,
          nombre: res.data.nombre,
          email: res.data.email,
          rol: res.data.rol,
        },
        res.data.token
      );

      // Redirigir según rol
      const rol = res.data.rol.toLowerCase();
      if (rol === "admin") {
        navigate("/adminpanel");
      } else if (rol === "cliente") {
        navigate("/reservas");
      } else {
        navigate("/reservas");
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      alert(error.response?.data?.error || "Error en login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;
