import { Router } from "express";
import { getServicios } from "../controllers/serviciocontroller";
import { verificarToken } from "../middlewares/authmiddleware";

const router = Router();

router.get("/", getServicios);

export default router;
