import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Registro from "./pages/registro";
import Reservas from "./pages/reservas";
import AdminPanel from "./pages/adminpanel";
import Navbar from "./components/navbar";
import { AuthProvider } from "./context/authcontext";
import AdminUsuarios from "./pages/adminusuarios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Router>
        <Navbar />
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />

          {/* Cliente */}
          <Route path="/reservas" element={<Reservas />} />

          {/* Admin */}
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/adminusuarios" element={<AdminUsuarios />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
