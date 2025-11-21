import { Request, Response } from "express";
import { database } from "../config/database";

export const getServicios = async (req: Request, res: Response) => {
  try {
    const [rows] = await database.query("SELECT * FROM servicios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios" });
  }
};
