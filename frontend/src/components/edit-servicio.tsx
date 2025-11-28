import React, { useState } from "react";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

interface EditServicioModalProps {
  servicioId: number;
  nombreActual: string;
  descripcionActual: string;
  duracionActual: number;
  precioActual: number;
  onClose: () => void;
  onSave: (
    id: number,
    nombre: string,
    descripcion: string,
    duracion: number,
    precio: number
  ) => void;
}

const EditServicioModal: React.FC<EditServicioModalProps> = ({
  servicioId,
  nombreActual,
  descripcionActual,
  duracionActual,
  precioActual,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Servicio>({
    id: servicioId,
    nombre: nombreActual,
    descripcion: descripcionActual,
    duracion: duracionActual,
    precio: precioActual,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      formData.id,
      formData.nombre,
      formData.descripcion,
      formData.duracion,
      formData.precio
    );
    onClose();
  };

  //maneja los cambio en los inputs para actualizar el estado del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duracion" || name === "precio" ? Number(value) : value,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Servicio</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripcion:
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duracion en minutos:
            <input
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
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

export default EditServicioModal;
