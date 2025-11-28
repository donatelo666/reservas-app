import { Request, Response } from "express";
import {
  actualizarEstadoReserva,
  actualizarUsuario,
  obtenerServicios,
  responderMensaje,
} from "../models/adminmodel";
import { obtenerUsuarios } from "../models/adminmodel";
import { eliminarUsuario } from "../models/adminmodel";
import { obtenerMensajesSoporte } from "../models/adminmodel";
import { crearServicio } from "../models/adminmodel";
import { actualizarServicio } from "../models/adminmodel";
import { eliminarServicio } from "../models/adminmodel";

//confirmar reserva
export const confirmarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const result = await actualizarEstadoReserva(id, "confirmada");

    res.json({ success: true });
  } catch (error) {
    console.error("Error al confirmar reserva:", error);
    res.status(500).json({ success: false, code: "error-confirmando" });
  }
};

//cancelar reserva
export const cancelarReservaController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const result = await actualizarEstadoReserva(id, "cancelada");

    res.json({ success: true });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    res.status(500).json({ success: false });
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
    console.error("Error con usuarios:", error);

    res.status(500).json({ success: false });
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
    res.json({ data: result });
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ success: false });
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
    res.json({ data: result });
  } catch (error) {
    console.error("Error eliminando:", error);
    res.status(500).json({ succes: false });
  }
};
//renderizar mensajes a soporte
export const getMensajesSoporteController = async (
  req: Request,
  res: Response
) => {
  try {
    const mensajes = await obtenerMensajesSoporte();
    res.json(mensajes);
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({ success: false });
  }
};

// responder mensaje de soporte
export const responderMensajeController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const { respuesta } = req.body;

    const result = await responderMensaje(id, respuesta);

    res.json({ data: result });
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ success: false });
  }
};

// Crear servicio
export const crearServicioController = async (req: Request, res: Response) => {
  try {
    const nuevoServicio = await crearServicio(req.body);
    res.status(201).json({ data: nuevoServicio });
  } catch (error) {
    console.error("Error creando:", error);
    res.status(500).json({ succes: false });
  }
};

// Obtener todos los servicios
export const obtenerServiciosController = async (
  req: Request,
  res: Response
) => {
  try {
    const servicios = await obtenerServicios();
    res.json(servicios);
  } catch (error) {
    console.error("Error con servicios:", error);

    res.status(500).json({ succes: false });
  }
};

// Actualizar servicio
export const actualizarServicioController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await actualizarServicio(id, req.body);
    res.json({ data: result });
  } catch (error) {
    console.error("Error actualizando:", error);
    res.status(500).json({ succes: false });
  }
};

// Eliminar un servicio por id
export const eliminarServicioController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const result = await eliminarServicio(id);
    res.json({ data: result });
  } catch (error) {
    console.error("Error eliminando:", error);
    res.status(500).json({ succes: false });
  }
};
