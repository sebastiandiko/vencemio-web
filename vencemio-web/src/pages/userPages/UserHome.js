import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card/Card";
import "./UserHome.css";

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // Lista de favoritos
  const [supermarkets, setSupermarkets] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedSuper, setSelectedSuper] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const superResponse = await axios.get("http://localhost:5000/api/superusers");
        const superData = superResponse.data.reduce((acc, supermarket) => {
          acc[supermarket.cod_super] = {
            cadena: supermarket.cadena,
            direccion: `${supermarket.direccion}, ${supermarket.ciudad}, ${supermarket.provincia}`,
          };
          return acc;
        }, {});
        setSupermarkets(superData);

        const categoryResponse = await axios.get("http://localhost:5000/api/tipos_product");
        const categoryData = categoryResponse.data.map((category) => category.nombre);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching filters:", error);
        alert("No se pudieron cargar los filtros.");
      }
    };

    fetchFilters();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:5000/api/productos";
      if (selectedSuper && selectedCategory) {
        url = `http://localhost:5000/api/productos/filter/${selectedSuper}/${selectedCategory}`;
      } else if (selectedSuper) {
        url = `http://localhost:5000/api/productos/byCodSuper/${selectedSuper}`;
      } else if (selectedCategory) {
        url = `http://localhost:5000/api/productos/byCategory/${selectedCategory}`;
      }

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedSuper, selectedCategory]);

  const handleFavoriteToggle = (product, isFavorite) => {
    setFavorites((prev) => {
      if (isFavorite) {
        return [...prev, product];
      }
      return prev.filter((fav) => fav.id !== product.id);
    });
  };

  return (
    <div className="user-home-container">
      <h1>Productos en descuento</h1>
      
      <div className="filters">
        <div>
          <label htmlFor="supermarket">Filtrar por Supermercado:</label>
          <select
            id="supermarket"
            value={selectedSuper}
            onChange={(e) => setSelectedSuper(e.target.value)}
          >
            <option value="">Todos los supermercados</option>
            {Object.entries(supermarkets).map(([codSuper, data]) => (
              <option key={codSuper} value={codSuper}>
                {data.cadena}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category">Filtrar por Categoría:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="favorites-button"
        onClick={() => navigate("/favorites", { state: { favorites } })}
      >
        Ver Favoritos ❤️
      </button>

      <div className="product-list">
        {products.map((product) => {
          const supermarketInfo = supermarkets[product.cod_super] || {
            cadena: "Supermercado no disponible",
            direccion: "Dirección no disponible",
          };

          return (
            <Card
              key={product.id}
              product={product}
              supermarket={supermarketInfo.cadena}
              address={supermarketInfo.direccion}
              onClick={() => navigate(`/product-detail/${product.id}`)}
              onFavorite={handleFavoriteToggle}
            />
          );
        })}
      </div>

      <button className="map-button" onClick={() => navigate("/map-screen")}>
        Ver en el Mapa
      </button>
    </div>
  );
}
