import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Registro from "./pages/registro";
import Reservas from "./pages/reservas";
import AdminPanel from "./pages/adminpanel";
import Navbar from "./components/navbar";
import { AuthProvider } from "./context/authcontext";
import AdminUsuarios from "./pages/adminusuarios";

function App() {
  return (
    <AuthProvider>
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
