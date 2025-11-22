import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import "../styles/admin-usuarios.css";
import EditUsuarioModal from "../components/edit-usuario";
import ConfirmModal2 from "../components/eliminar-usuario-modal";

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
    rol: string //  restringir aquí
  ) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/edit-usuarios/${id}`, // 👈 id en la URL
        { nombre, email, rol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Usuario editado");
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, nombre, email, rol } : u))
      );
    } catch (error) {
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
      alert("Usuario eliminada");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar reserva", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tabla usuarios</h2>

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
            {usuarios.map((usuario) => (
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
