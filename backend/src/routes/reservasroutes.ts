import { Router } from "express";
import {
  crearReservaController,
  obtenerReservasController,
  obtenerReservasPorUsuarioController,
  actualizarReservaController,
  eliminarReservaController,
} from "../controllers/reservascontroller";
import { verificarToken, verificarAdmin } from "../middlewares/authmiddleware";

const router = Router();

router.post("/", verificarToken, crearReservaController);
router.get("/", verificarToken, verificarAdmin, obtenerReservasController);
router.get(
  "/usuario/:usuarioId",
  verificarToken,
  obtenerReservasPorUsuarioController
);
router.put("/actualizar/:id", verificarToken, actualizarReservaController);
router.delete("/eliminar/:id", verificarToken, eliminarReservaController);

export default router;
