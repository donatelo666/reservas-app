import { Request, Response } from "express";
import {
  actualizarEstadoReserva,
  actualizarUsuario,
} from "../models/adminmodel";
import { obtenerUsuarios } from "../models/adminmodel";
import { eliminarUsuario } from "../models/adminmodel";

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

// Obtener todos los usuarios
export const obtenerUsuariosController = async (
  req: Request,
  res: Response
) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// Actualizar usuario
export const actualizarUsuarioController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await actualizarUsuario(id, req.body);
    res.json({ message: "Reserva actualizada", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
};

// Eliminar usuario
export const eliminarUsuarioController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await eliminarUsuario(id);
    res.json({ message: "Usuario eliminado", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la reserva" });
  }
};
