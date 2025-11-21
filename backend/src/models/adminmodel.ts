import { database } from "../config/database";

// Tipado de Reserva
export interface Reserva {
  id?: number;
  usuario_id: number;

  estado?: "pendiente" | "confirmada" | "cancelada";
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
