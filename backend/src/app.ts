//importaciones principales
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { database } from "./config/database";
import reservasRoutes from "./routes/reservasroutes";
import usuariosRoutes from "./routes/usuariosroutes";
import servicioRoutes from "./routes/servicioroutes";
import adminRoutes from "./routes/adminroutes";

dotenv.config();

const app: Application = express();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en .env");
}

export default JWT_SECRET;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/reservas", reservasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/admin", adminRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
