import { database } from "../config/database";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  rol: "cliente" | "admin";
}

// Para actualización de perfil
export interface UsuarioUpdate {
  nombre: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface Mensaje {
  usuario_id: number;
  asunto: string;
  mensaje: Text;
}

// Crear usuario para registro
export const crearUsuario = async (usuario: Usuario) => {
  const [result] = await database.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    [usuario.nombre, usuario.email, usuario.password, usuario.rol || "cliente"]
  );
  return result;
};

// Buscar usuario por email para login
export const buscarUsuarioPorEmail = async (email: string) => {
  const [rows] = await database.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows as Usuario[];
};

export const actualizarPerfil = async (id: number, datos: UsuarioUpdate) => {
  try {
    // 1. Buscar usuario

    const [rows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const usuario = rows[0];

    // 2. Validar contraseña actual
    const esValida = await bcrypt.compare(datos.oldPassword, usuario.password);
    if (!esValida) {
      throw new Error("Credenciales inválidas");
    }

    // 3. Encriptar nueva contraseña
    const hashed = await bcrypt.hash(datos.newPassword, 10);

    // 4. Guardar cambios
    await database.query(
      "UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?",
      [datos.nombre, datos.email, hashed, id]
    );

    return true;
  } catch (error) {
    console.error("Error en actualizarPerfil:", error);
    throw error; // el controlador se encarga de responder al cliente
  }
};

// enviar un mensaje a soporte
export const enviarMensajeSoporte = async (mensaje: Mensaje) => {
  const [result] = await database.query<ResultSetHeader>(
    "INSERT INTO mensajes_soporte (usuario_id, asunto, mensaje) VALUES (?, ?, ?)",
    [mensaje.usuario_id, mensaje.asunto, mensaje.mensaje]
  );

  return { success: result.affectedRows > 0 };
};

export const obtenerMensajesSoporte = async (Id: number) => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT 
       m.asunto,
       m.mensaje,
       m.estado,
       m.respuesta_admin
     FROM mensajes_soporte m
     WHERE m.usuario_id = ?
     ORDER BY m.created_at DESC`,
    [Id]
  );
  return rows;
};
