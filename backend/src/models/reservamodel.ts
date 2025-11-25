import { database } from "../config/database";

// Tipado de Reserva
export interface Reserva {
  id: number;
  usuario_id: number;
  servicio_id: number;
  fecha: string; // formato YYYY-MM-DD
  hora: string; // formato HH:MM:SS
  estado: "pendiente" | "confirmada" | "cancelada";
}

// Crear una nueva reserva
export const crearReserva = async (reserva: Reserva) => {
  const [result] = await database.query(
    "INSERT INTO reservas (usuario_id, servicio_id, fecha, hora, estado) VALUES (?, ?, ?, ?, ?)",
    [
      reserva.usuario_id,
      reserva.servicio_id,
      reserva.fecha,
      reserva.hora,
      reserva.estado || "pendiente",
    ]
  );
  return result;
};

// Obtener todas las reservas con datos de usuario y servicio
export const obtenerReservas = async () => {
  const [rows] = await database.query(
    `SELECT 
       r.id,
       r.usuario_id,
       u.nombre AS usuario_nombre,
       s.nombre AS servicio_nombre,
       DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,
       DATE_FORMAT(r.hora, '%H:%i') AS hora,
       r.estado
     FROM reservas r
     JOIN usuarios u ON r.usuario_id = u.id
     JOIN servicios s ON r.servicio_id = s.id
     ORDER BY r.fecha DESC, r.hora DESC`
  );
  return rows;
};

// Obtener reservas por usuario con fecha formateada
export const obtenerReservasPorUsuario = async (usuarioId: number) => {
  const [rows] = await database.query(
    `SELECT 
       r.id,
       r.usuario_id,
       s.nombre AS servicio_nombre,
       DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,
       DATE_FORMAT(r.hora, '%H:%i') AS hora,
       r.estado
     FROM reservas r
     JOIN servicios s ON r.servicio_id = s.id
      WHERE r.usuario_id = ?`, //👈 aquí usas el parámetro

    [usuarioId]
  );
  return rows;
};

// Actualizar una reserva
export const actualizarReserva = async (
  id: number,
  datos: Partial<Reserva>
) => {
  const [result] = await database.query(
    "UPDATE reservas SET fecha = ?, hora = ?, estado = ? WHERE id = ?",
    [datos.fecha, datos.hora, datos.estado, id]
  );
  return result;
};

// Eliminar una reserva
export const eliminarReserva = async (id: number) => {
  const [result] = await database.query("DELETE FROM reservas WHERE id = ?", [
    id,
  ]);
  return result;
};
