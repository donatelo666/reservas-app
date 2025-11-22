import { database } from "../config/database";

// Tipado de Reserva
export interface Reserva {
  id?: number;
  usuario_id: number;

  estado?: "pendiente" | "confirmada" | "cancelada";
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
}

export const actualizarEstadoReserva = async (
  reservaId: number,
  estado: "pendiente" | "confirmada" | "cancelada"
) => {
  const [result] = await database.query(
    "UPDATE reservas SET estado = ? WHERE id = ?",
    [estado, reservaId]
  );
  return result;
};

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  const [rows] = await database.query(`SELECT * FROM usuarios;`);
  return rows;
};

// Actualizar un usuario
export const actualizarUsuario = async (
  id: number,
  datos: Partial<Usuario>
) => {
  const [result] = await database.query(
    "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
    [datos.nombre, datos.email, datos.rol, id]
  );
  return result;
};

// Eliminar una reserva
export const eliminarUsuario = async (id: number) => {
  const [result] = await database.query("DELETE FROM usuarios WHERE id = ?", [
    id,
  ]);
  return result;
};
