import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Bienvenido al Sistema de Reservas</h1>
      <p>
        Administra tus servicios y reservas de manera fácil y rápida con nuestra
        plataforma.
      </p>

      {!user && (
        <div>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/registro">Registrarse</Link>
        </div>
      )}

      {user && user.rol === "cliente" && (
        <div>
          <Link to="/reservas">Mis Reservas</Link>
        </div>
      )}

      {user && user.rol === "admin" && (
        <div>
          <Link to="/adminpanel">Ver reservas</Link>
          <br></br>
          <br></br>
          <Link to="/adminusuarios">Ver usuarios</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
