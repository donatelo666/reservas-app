import { Request, Response } from "express";
import { database } from "../config/database";
import { RowDataPacket } from "mysql2";
import { Servicio } from "../models/servicio";

export const getServicios = async (req: Request, res: Response) => {
  try {
    const [rows] = await database.query<(Servicio & RowDataPacket)[]>(
      "SELECT * FROM servicios"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error renderizando servicios:", error);
    res.status(500).json({ success: false });
  }
};
