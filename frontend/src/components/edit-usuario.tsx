import React, { useState } from "react";
import "../styles/edit-usuario.css";

interface EditUsuarioModalProps {
  usuarioId: number;
  nombreActual: string;
  emailActual: string;
  rolActual: string;
  onClose: () => void;
  onSave: (id: number, nombre: string, email: string, rol: string) => void;
}

const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({
  usuarioId,
  nombreActual,
  emailActual,
  rolActual,
  onClose,
  onSave,
}) => {
  const [nombre, setNombre] = useState(nombreActual);
  const [email, setEmail] = useState(emailActual);
  const [rol, setRol] = useState(rolActual);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(usuarioId, nombre, email, rol);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
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

export default EditUsuarioModal;
