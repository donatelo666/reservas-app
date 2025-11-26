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
    res.status(201).json({ data: nuevaReserva });
  } catch (error) {
    console.error("Error creando:", error);
    res.status(500).json({ succes: false });
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
    console.error("Error con reservas:", error);

    res.status(500).json({ succes: false });
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
    console.error("Error renderizando:", error);
    return res.status(500).json({ succes: false });
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
    res.json({ data: result });
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ succes: false });
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
    res.json({ data: result });
  } catch (error) {
    console.error("Error eliminando:", error);
    res.status(500).json({ succes: false });
  }
};
