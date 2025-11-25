import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import EditUsuarioModal from "../components/edit-usuario";
import ConfirmModal2 from "../components/eliminar-usuario-modal";
import { toast } from "react-toastify";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

function AdminUsuarios() {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [rolFiltro, setRolFiltro] = useState(""); // vacio = todos

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTexto =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toString().includes(searchTerm);

    const coincideRol = rolFiltro ? u.rol === rolFiltro : true;

    return coincideTexto && coincideRol;
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!token || user?.rol !== "admin") return;
      try {
        const res = await axios.get(
          "http://localhost:4000/api/admin/usuarios",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios", error);
      }
    };
    fetchUsuarios();
  }, [token, user]);

  const editarUsuario = async (
    id: number,
    nombre: string,
    email: string,
    rol: string //  restringir aquí a string
  ) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/edit-usuarios/${id}`, // 👈 id en la URL
        { nombre, email, rol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Usuario editado con exito");

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, nombre, email, rol } : u))
      );
    } catch (error) {
      toast.error("❌ Error al editar usuario");
      console.error("Error al editar usuario", error);
    }
  };

  const eliminarUsuario = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admin/delete-usuarios/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Usuario eliminado correctamente");

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      toast.error("❌ Error al eliminar usuario");
      console.error("Error al eliminar reserva", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="titulos">Tabla usuarios</h2>
      <h2 className="titulos">Buscador</h2>

      <div className="buscador-container">
        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre, email o id "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      {user?.rol !== "admin" ? (
        <p>No tienes acceso a esta sección</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>

                <td>
                  <button onClick={() => setUsuarioEditando(usuario)}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => setUsuarioAEliminar(usuario)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {usuarioEditando && (
        <EditUsuarioModal
          usuarioId={usuarioEditando.id}
          nombreActual={usuarioEditando.nombre}
          emailActual={usuarioEditando.email}
          rolActual={usuarioEditando.rol}
          onClose={() => setUsuarioEditando(null)}
          onSave={editarUsuario}
        />
      )}

      {usuarioAEliminar && (
        <ConfirmModal2
          message="¿Seguro que quieres eliminar este usuario?"
          onConfirm={() => {
            eliminarUsuario(usuarioAEliminar.id);
            setUsuarioAEliminar(null);
          }}
          onCancel={() => setUsuarioAEliminar(null)}
        />
      )}
    </div>
  );
}
export default AdminUsuarios;
