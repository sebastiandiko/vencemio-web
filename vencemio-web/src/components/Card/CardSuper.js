import React from "react";
import "./Card.css";

const CardSuper = ({ product, onEdit, onDelete }) => {
  const {
    nombre,
    precio,
    precio_descuento,
    porcentaje_descuento,
    fecha_vencimiento,
    imagen,
  } = product;

  return (
    <div className="card">
      {/* Badge de descuento */}
      <div className="card-discount-badge">
        {Math.round(porcentaje_descuento)}% OFF
      </div>      
      {/* Imagen del producto */}
      <img
        src={imagen || "/default-image.jpg"}
        alt={nombre}
        className="card-image"
      />
      {/* Título del producto */}
      <h3 className="card-title">{nombre}</h3>
      <div className="card-prices">
        <p className="card-original-price">${precio}</p>
        <p className="card-discounted-price">${precio_descuento}</p>
      </div>
      {/* Fecha de vencimiento */}
      <p className="card-expiration">
        vto - {new Date(fecha_vencimiento).toLocaleDateString()}
      </p>
      {/* Acciones: Editar y Eliminar */}
      <div className="card-actions">
        <button
          className="edit-button"
          onClick={onEdit}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardSuper;

