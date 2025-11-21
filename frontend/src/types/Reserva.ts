// types/Reserva.ts
export interface Reserva {
  id: string;
  servicioId: string;
  usuarioId: string;
  fecha: string; // ISO string
  hora: string;
  estado: "pendiente" | "confirmada" | "cancelada";
}
