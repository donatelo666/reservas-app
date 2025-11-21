import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  usuario?: { id: number; rol: "cliente" | "admin" };
}

// Verificar token
export const verificarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      rol: "cliente" | "admin";
    };
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// Verificar rol admin
export const verificarAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.usuario?.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso restringido a administradores" });
  }
  next();
};
