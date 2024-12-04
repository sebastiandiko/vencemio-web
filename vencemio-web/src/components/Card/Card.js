import React, { useState, useEffect } from "react";
import "./Card.css";

const Card = ({ product, supermarket, address, onClick, onFavorite, initialFavoriteState }) => {
  const {
    nombre,
    precio,
    precio_descuento,
    porcentaje_descuento,
    fecha_vencimiento,
    imagen,
    id,
  } = product;

  // Estado local de isFavorite, puede ser inicializado desde una prop `initialFavoriteState`
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);

  // Cuando el estado de favorito cambia, notificamos al padre
  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite; // Alternamos el estado
    setIsFavorite(newFavoriteState); // Actualizamos el estado local

    // Enviamos el nuevo estado al componente padre
    if (onFavorite) {
      onFavorite(product, newFavoriteState); // Notify parent
    }
  };

  // Aquí puedes hacer una consulta a la API para obtener si este producto ya está marcado como favorito
  useEffect(() => {
    // Este `useEffect` puede usar un flag `initialFavoriteState` que se pasará desde el componente padre
    // Esto se ejecutará solo una vez cuando el componente se monte
    // Asegúrate de que `initialFavoriteState` sea enviado correctamente
  }, [initialFavoriteState]);

  return (
    <div className="card">
      <div className="card-discount-badge">{Math.round(porcentaje_descuento)}% OFF</div>
      <img src={imagen || "/default-image.jpg"} alt={nombre} className="card-image" />
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
