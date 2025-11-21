import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { crearUsuario, buscarUsuarioPorEmail } from "../models/usuariomodel";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Registro
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
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
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
      message: "Login exitoso",
      token,
      ...payload,
    });
  } catch (error) {
    console.error("Error en loginController:", error);
    res.status(500).json({ error: "Error en el login" });
  }
};
