import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { crearUsuario, buscarUsuarioPorEmail } from "../models/usuariomodel";
import { actualizarPerfil } from "../models/usuariomodel";
import { enviarMensajeSoporte } from "../models/usuariomodel";
import { obtenerMensajesSoporte } from "../models/usuariomodel";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Registro controlador
export const registroController = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si ya existe
    const existente = await buscarUsuarioPorEmail(email);
    if (existente.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await crearUsuario({ nombre, email, password: hashedPassword, rol });
    res.status(201).json({ succes: true });
  } catch (error) {
    console.error("Error registrando: ", error);
    res.status(500).json({ succes: false });
  }
};

//login controlador
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const usuarios = await buscarUsuarioPorEmail(email);
    if (usuarios.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];
    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token con payload completo
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Devolver datos completos
    res.json({
      token,
      ...payload,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ succes: false });
  }
};

// Actualizar perfil
export const actualizarPerfilController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, email, oldPassword, newPassword } = req.body;
    const result = await actualizarPerfil(id, {
      nombre,
      email,
      oldPassword,
      newPassword,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ succes: false });
  }
};

export const enviarMensajeSoporteController = async (
  req: Request,
  res: Response
) => {
  try {
    const usuario_id = Number(req.params.id); //  aquí tomas el id de la URL
    const { asunto, mensaje } = req.body;

    // verificacion de id coincidente con id del token
    const authUserId = (req as any).usuario.id;

    if (usuario_id !== authUserId) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }

    await enviarMensajeSoporte({ usuario_id, asunto, mensaje });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error guardando mensaje de soporte:", error);
    res.status(500).json({ success: false });
  }
};

//renderizar mensajes a soporte
export const obtenermensajesController = async (
  req: Request,
  res: Response
) => {
  try {
    const usuarioId = Number(req.params.id); // 👈 usar el mismo nombre que en la ruta

    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "usuarioId inválido" });
    }

    const mensajes = await obtenerMensajesSoporte(usuarioId);
    return res.json(mensajes);
  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({ success: false });
  }
};
