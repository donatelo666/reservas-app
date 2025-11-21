import { Request, Response } from "express";
import {
  crearReserva,
  obtenerReservas,
  obtenerReservasPorUsuario,
  actualizarReserva,
  eliminarReserva,
} from "../models/reservamodel";

// Crear reserva
export const crearReservaController = async (req: Request, res: Response) => {
  try {
    const nuevaReserva = await crearReserva(req.body);
    res.status(201).json({ message: "Reserva creada", data: nuevaReserva });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

// Obtener todas las reservas
export const obtenerReservasController = async (
  req: Request,
  res: Response
) => {
  try {
    const reservas = await obtenerReservas();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// Obtener reservas por usuario
export const obtenerReservasPorUsuarioController = async (
  req: Request,
  res: Response
) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "usuarioId inválido" });
    }

    const reservas = await obtenerReservasPorUsuario(usuarioId);

    return res.json(reservas);
  } catch (error) {
    console.error("Error en obtenerReservasPorUsuarioController:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener reservas del usuario" });
  }
};

// Actualizar reserva
export const actualizarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await actualizarReserva(id, req.body);
    res.json({ message: "Reserva actualizada", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
};

// Eliminar reserva
export const eliminarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await eliminarReserva(id);
    res.json({ message: "Reserva eliminada", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la reserva" });
  }
};
