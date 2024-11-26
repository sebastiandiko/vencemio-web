import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import "./FavoritesPage.css";

const FavoritesPage = ({ favorites, onRemoveFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="favorites-container">
      <h1>Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <p className="no-favorites-message">No tienes productos en favoritos.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((product) => (
            <Card
              key={product.id}
              product={product}
              supermarket={product.supermarket}
              address={product.address}
              onClick={() => navigate(`/product-detail/${product.id}`)}
              onFavorite={() => onRemoveFavorite(product)} // Permite eliminar de favoritos
            />
          ))}
        </div>
      )}
      <button className="back-button" onClick={() => navigate("/")}>
        Volver a la Página Principal
      </button>
    </div>
  );
};

export default FavoritesPage;
