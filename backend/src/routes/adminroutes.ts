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
import {
  crearServicioController,
  obtenerServiciosController,
  actualizarServicioController,
  eliminarServicioController,
} from "../controllers/admincontroller";

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

//rutas de servicios

//crear
router.post(
  "/crear-servicio",
  verificarToken,
  verificarAdmin,
  crearServicioController
);
//ver servicios
router.get(
  "/ver-servicios",
  verificarToken,
  verificarAdmin,
  obtenerServiciosController
);
//actualizar
router.put(
  "/actualizar-servicio/:id",
  verificarToken,
  verificarAdmin,
  actualizarServicioController
);
//eliminar
router.delete(
  "/eliminar-servicio/:id",
  verificarToken,
  verificarAdmin,
  eliminarServicioController
);

export default router;
