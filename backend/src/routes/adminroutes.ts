import { Router } from "express";
import {
  confirmarReservaController,
  cancelarReservaController,
  getMensajesSoporteController,
  responderMensajeController,
} from "../controllers/admincontroller";
import { verificarToken, verificarAdmin } from "../middlewares/authmiddleware";
import { obtenerUsuariosController } from "../controllers/admincontroller";
import { actualizarUsuarioController } from "../controllers/admincontroller";
import { eliminarUsuarioController } from "../controllers/admincontroller";

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
router.get(
  "/usuarios",
  verificarToken,
  verificarAdmin,
  obtenerUsuariosController
);
router.put(
  "/edit-usuarios/:id",
  verificarToken,
  verificarAdmin,
  actualizarUsuarioController
);

router.delete(
  "/delete-usuarios/:id",
  verificarToken,
  verificarAdmin,
  eliminarUsuarioController
);

router.get(
  "/mensajes",
  verificarToken,
  verificarAdmin,
  getMensajesSoporteController
);

router.put(
  "/mensaje-respuesta/:id",
  verificarToken,
  verificarAdmin,
  responderMensajeController
);

export default router;
