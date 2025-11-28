import { database } from "../config/database";
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

// Tipado de Reserva
export interface Reserva {
  id?: number;
  usuario_id: number;

  estado?: "pendiente" | "confirmada" | "cancelada";
}

// Tipado de servicio
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}
//usuario
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "cliente" | "admin";
}
//actualizar estado reserva
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

// Eliminar un usuario
export const eliminarUsuario = async (id: number) => {
  const [result] = await database.query("DELETE FROM usuarios WHERE id = ?", [
    id,
  ]);
  return result;
};

//ver mensajes a soporte
export const obtenerMensajesSoporte = async () => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT 
       m.id,
       m.usuario_id,
       m.asunto,
       m.mensaje,
       m.estado,
       DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
       m.respuesta_admin,
       u.nombre AS usuario_nombre
       
       
     FROM mensajes_soporte m
     JOIN usuarios u ON m.usuario_id = u.id
     
     ORDER BY m.created_at DESC`
  );
  return rows;
};

//responder mensaje modelo
export const responderMensaje = async (
  id: number,

  respuesta: string
) => {
  const [result] = await database.query(
    "UPDATE mensajes_soporte SET  respuesta_admin = ?, estado = ? WHERE id = ?",
    [respuesta, "respondido", id]
  );
  return { success: true };
};

// Crear un nuevo servicio
export const crearServicio = async (servicio: Servicio) => {
  const [result] = await database.query(
    "INSERT INTO servicios (nombre, descripcion, duracion, precio) VALUES (?, ?, ?, ?)",
    [servicio.nombre, servicio.descripcion, servicio.duracion, servicio.precio]
  );
  return result;
};

// Obtener todos los servicios
export const obtenerServicios = async () => {
  const [rows] = await database.query("SELECT * FROM servicios");
  return rows;
};

// Actualizar un servicio
export const actualizarServicio = async (
  id: number,
  datos: Partial<Servicio>
) => {
  const [result] = await database.query(
    "UPDATE servicios SET nombre = ?, descripcion = ?, duracion = ?, precio = ? WHERE id = ?",
    [datos.nombre, datos.descripcion, datos.duracion, datos.precio, id]
  );
  return result;
};
// Eliminar un servicio
export const eliminarServicio = async (id: number) => {
  const [result] = await database.query("DELETE FROM servicios WHERE id = ?", [
    id,
  ]);
  return result;
};
