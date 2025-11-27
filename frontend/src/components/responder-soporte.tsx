import React, { useState } from "react";
import "../styles/edit-modal.css";

interface mensajeProps {
  mensajeId: number;
  respuestaActual: string;
  onClose: () => void;
  onSave: (id: number, respuesta: string) => void;
}

const ResponderSoporteModal: React.FC<mensajeProps> = ({
  mensajeId,
  respuestaActual,

  onClose,
  onSave,
}) => {
  const [respuesta, setRespuesta] = useState(respuestaActual ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(mensajeId, respuesta);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Responder mensaje</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Respuesta:
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn-save">
              Enviar
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

export default ResponderSoporteModal;
