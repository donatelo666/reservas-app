import { Router } from "express";
import {
  registroController,
  loginController,
  enviarMensajeSoporteController,
  obtenermensajesController,
} from "../controllers/usuarioscontroller";
import { actualizarPerfilController } from "../controllers/usuarioscontroller";

import { verificarToken } from "../middlewares/authmiddleware";

const router = Router();

router.post("/registro", registroController);
router.post("/login", loginController);
router.put("/perfil/:id", verificarToken, actualizarPerfilController);
router.post("/mensaje/:id", verificarToken, enviarMensajeSoporteController);
router.get("/mensajes/:id", verificarToken, obtenermensajesController);

export default router;
