import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import EditServicioModal from "../components/edit-servicio";

import { toast } from "react-toastify";
import EliminarServicio from "../components/eliminar-servicio";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

function Servicios() {
  const { user, token } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState<Servicio>({
    id: 0,
    nombre: "",
    descripcion: "",
    duracion: 0,
    precio: 0,
  });
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(
    null
  );
  const [servicioAEliminar, setServicioAEliminar] = useState<Servicio | null>(
    null
  );

  //renderizar servicios en front
  const fetchServicios = async () => {
    if (!token || user?.rol !== "admin") return;
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/ver-servicios",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServicios(res.data);
    } catch (error) {
      console.error("Error al obtener servicios", error);
    }
  };
  //doble declracion para poder reusar fetchservicios
  useEffect(() => {
    fetchServicios();
  }, [token, user]);

  // Crear nuevo servcio con handlesubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || user?.rol !== "admin") return;

    try {
      await axios.post(
        "http://localhost:4000/api/admin/crear-servicio",
        { ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("servicio creado con exito");

      setFormData({
        id: 0,
        nombre: "",
        descripcion: "",
        duracion: 0,
        precio: 0,
      }); //formulario reseteado
      fetchServicios(); //llama al fetch de nuevo
    } catch (error: any) {
      toast.error("Error al crear servicio");
    }
  };

  //maneja los cambio en los inputs para actualizar el estado del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "duracion" || name === "precio" || name === "id"
          ? Number(value)
          : value,
    });
  };

  const editarServicio = async (
    id: number,
    nombre: string,
    descripcion: string,
    duracion: number,
    precio: number
  ) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/actualizar-servicio/${id}`, // 👈 id en la URL
        { nombre, descripcion, duracion, precio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Servicio editado con exito");

      setServicios((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, nombre, descripcion, duracion, precio } : s
        )
      );
    } catch (error) {
      toast.error("❌ Error al editar servicio");
      console.error("Error al editar servicio", error);
    }
  };

  const eliminarServicio = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admin/eliminar-servicio/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("servicio eliminado correctamente");

      setServicios((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      toast.error("❌ Error al eliminar servicio");
      console.error("Error al eliminar servicio", error);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="titulos">Crear un servicio</h2>

      {/* Formulario de creacion*/}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          descripcion:
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Duracion en minutos:
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Precio:
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <button type="submit">Crear Servicio</button>
      </form>

      <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Duracion en minutos</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr key={servicio.id}>
              <td>{servicio.id}</td>
              <td>{servicio.nombre}</td>
              <td>{servicio.descripcion}</td>
              <td>{servicio.duracion}</td>
              <td>{servicio.precio}</td>
              <td>
                <button onClick={() => setServicioEditando(servicio)}>
                  ✏️ Editar
                </button>
                <button onClick={() => setServicioAEliminar(servicio)}>
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {servicioEditando && (
        <EditServicioModal
          servicioId={servicioEditando.id}
          nombreActual={servicioEditando.nombre}
          descripcionActual={servicioEditando.descripcion}
          duracionActual={servicioEditando.duracion}
          precioActual={servicioEditando.precio}
          onClose={() => setServicioEditando(null)}
          onSave={editarServicio}
        />
      )}

      {servicioAEliminar && (
        <EliminarServicio
          message="¿Seguro que quieres eliminar este servicio?"
          onConfirm={() => {
            eliminarServicio(servicioAEliminar.id);
            setServicioAEliminar(null);
          }}
          onCancel={() => setServicioAEliminar(null)}
        />
      )}
    </div>
  );
}

export default Servicios;
