import { database } from "../config/database";

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol?: "cliente" | "admin";
}

// Crear usuario
export const crearUsuario = async (usuario: Usuario) => {
  const [result] = await database.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    [usuario.nombre, usuario.email, usuario.password, usuario.rol || "cliente"]
  );
  return result;
};

// Buscar usuario por email
export const buscarUsuarioPorEmail = async (email: string) => {
  const [rows] = await database.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows as Usuario[];
};
