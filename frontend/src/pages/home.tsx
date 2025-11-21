import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Bienvenido al Sistema de Reservas</h1>
      <p>
        Administra tus servicios y reservas de manera fácil y rápida con nuestra
        plataforma.
      </p>

      {!user && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/login" style={{ marginRight: "15px" }}>
            Iniciar Sesión
          </Link>
          <Link to="/registro">Registrarse</Link>
        </div>
      )}

      {user && user.rol === "cliente" && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/reservas">Mis Reservas</Link>
        </div>
      )}

      {user && user.rol === "admin" && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/admin">Panel de Administración</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
