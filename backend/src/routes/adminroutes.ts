import { Router } from "express";
import {
  confirmarReservaController,
  cancelarReservaController,
} from "../controllers/admincontroller";
import { verificarToken, verificarAdmin } from "../middlewares/authmiddleware";

const router = Router();

router.put(
  "/reservas/:id/confirmar",
  verificarToken,
  verificarAdmin,
  confirmarReservaController
);
router.put(
  "/reservas/:id/cancelar",
  verificarToken,
  verificarAdmin,
  cancelarReservaController
);

export default router;
