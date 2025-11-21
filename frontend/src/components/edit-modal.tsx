import React, { useState } from "react";
import "../styles/edit-modal.css";

interface EditReservaModalProps {
  reservaId: number;
  fechaActual: string;
  horaActual: string;
  onClose: () => void;
  onSave: (id: number, fecha: string, hora: string) => void;
}

const EditReservaModal: React.FC<EditReservaModalProps> = ({
  reservaId,
  fechaActual,
  horaActual,
  onClose,
  onSave,
}) => {
  const [fecha, setFecha] = useState(fechaActual);
  const [hora, setHora] = useState(horaActual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(reservaId, fecha, hora);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Reserva</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Fecha:
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>
          <label>
            Hora:
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Guardar
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservaModal;
