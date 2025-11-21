import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Probar la conexión
async function testConnection() {
  try {
    const conexion = await database.getConnection();
    console.log("✅ Conexión a MySQL exitosa");
    conexion.release(); // liberar conexión
  } catch (err) {
    console.error("❌ Error al conectar a MySQL:", err);
  }
}

testConnection();
