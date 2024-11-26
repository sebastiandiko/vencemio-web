import React, { useState } from "react";
import "./Card.css";

const Card = ({ product, supermarket, address, onClick, onFavorite }) => {
  const {
    nombre,
    precio,
    precio_descuento,
    porcentaje_descuento,
    fecha_vencimiento,
    imagen,
  } = product;

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite); // Update local state
    if (onFavorite) onFavorite(product, !isFavorite); // Notify parent
  };

  return (
    <div className="card">
      <div className="card-discount-badge">{porcentaje_descuento}% OFF</div>
      <img
        src={imagen || "/default-image.jpg"}
        alt={nombre}
        className="card-image"
      />
      <h3 className="card-title">{nombre}</h3>
      <p className="card-address">
        📍 {supermarket} - {address}
      </p>
      <div className="card-prices">
        <p className="card-original-price">${precio}</p>
        <p className="card-discounted-price">${precio_descuento}</p>
      </div>
      <p className="card-expiration">
        vto - {new Date(fecha_vencimiento).toLocaleDateString()}
      </p>
      <div className="card-actions">
        <button
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default Card;
