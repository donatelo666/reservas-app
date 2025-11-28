import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesion cerrada");
    navigate("/"); // redireccion al home
  };

  return (
    <nav>
      <h1> Gestor de reservas</h1>
      <Link to="/">Home</Link>

      {!user && (
        <>
          <Link to="/login">Iniciar sesion</Link>
          <Link to="/registro">Registro</Link>
        </>
      )}

      {user && user.rol === "cliente" && (
        <Link to="/reservas">Mis Reservas</Link>
      )}

      {user && user.rol === "cliente" && <Link to="/perfil">Mi Perfil</Link>}
      {user && user.rol === "cliente" && (
        <Link to="/soporte">Soporte tecnico</Link>
      )}

      {user && user.rol === "admin" && <Link to="/reservas">Mis Reservas</Link>}

      {user && user.rol === "admin" && (
        <Link to="/adminpanel">Ver reservas</Link>
      )}

      {user && user.rol === "admin" && (
        <Link to="/adminusuarios">Ver usuarios</Link>
      )}
      {user && user.rol === "admin" && <Link to="/mensajes">Ver mensajes</Link>}
      {user && user.rol === "admin" && (
        <Link to="/servicios">Ver servicios</Link>
      )}

      {user && <button onClick={handleLogout}>Cerrar sesion</button>}
    </nav>
  );
}

export default Navbar;
