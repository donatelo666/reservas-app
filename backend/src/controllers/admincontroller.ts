import { Request, Response } from "express";
import { actualizarEstadoReserva } from "../models/adminmodel";

export const confirmarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const result = await actualizarEstadoReserva(id, "confirmada");

    res.json({ message: "Reserva confirmada" });
  } catch (error) {
    console.error("Error al confirmar reserva:", error);
    res.status(500).json({ error: "Error al confirmar reserva" });
  }
};

export const cancelarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const result = await actualizarEstadoReserva(id, "cancelada");

    res.json({ message: "Reserva cancelada" });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    res.status(500).json({ error: "Error al cancelar reserva" });
  }
};
