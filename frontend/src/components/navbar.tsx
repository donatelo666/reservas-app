import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redireccion al home
  };

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "10px", color: "#fff" }}>
        Home
      </Link>

      {!user && (
        <>
          <Link to="/login" style={{ marginRight: "10px", color: "#fff" }}>
            Login
          </Link>
          <Link to="/registro" style={{ marginRight: "10px", color: "#fff" }}>
            Registro
          </Link>
        </>
      )}

      {user && user.rol === "cliente" && (
        <Link to="/reservas" style={{ marginRight: "10px", color: "#fff" }}>
          Mis Reservas
        </Link>
      )}

      {user && user.rol === "admin" && (
        <Link to="/adminpanel" style={{ marginRight: "10px", color: "#fff" }}>
          Panel Admin
        </Link>
      )}

      {user && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "10px",
            background: "red",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
