import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card/Card";
import { useUser } from "../../context/UserContext";
import "./UserHome.css";

export default function UserHome() {
  const { favorites, setFavorites } = useUser(); // Gestionar favoritos desde el contexto
  const [products, setProducts] = useState([]);
  const [supermarkets, setSupermarkets] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedSuper, setSelectedSuper] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchName, setSearchName] = useState(""); // Filtro por nombre
  const [currentLocation, setCurrentLocation] = useState(null); // Ubicación del usuario
  const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Estado de carga para la ubicación
  const [showLoadingScreen, setShowLoadingScreen] = useState(true); // Controla la pantalla de carga
  const navigate = useNavigate();

  // Función para obtener la distancia entre dos coordenadas
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  };

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false); // Ubicación obtenida
        },
        (err) => {
          console.error("Error al obtener la ubicación actual:", err);
          setIsLoadingLocation(false); // Si no se obtiene ubicación, dejamos de mostrar el loading
        }
      );
    } else {
      console.error("Geolocalización no soportada por este navegador.");
      setIsLoadingLocation(false); // Si geolocalización no está soportada
    }
  }, []);

  // Retrasar la carga de productos para esperar por la ubicación
  useEffect(() => {
    if (!isLoadingLocation) {
      setTimeout(() => {
        setShowLoadingScreen(false); // Después de 3 segundos, mostramos la pantalla de productos
      }, 3000);
    }
  }, [isLoadingLocation]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const superResponse = await axios.get("http://localhost:5000/api/superusers");
        const superData = superResponse.data.reduce((acc, supermarket) => {
          acc[supermarket.cod_super] = {
            cadena: supermarket.cadena,
            direccion: `${supermarket.direccion}, ${supermarket.ciudad}, ${supermarket.provincia}`,
            lat: supermarket.ubicacion.latitud, // Guardar latitud
            lng: supermarket.ubicacion.longitud, // Guardar longitud
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

  const fetchProducts = useCallback(async () => {
    if (!currentLocation) return; // Evitar fetch hasta que la ubicación esté disponible

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
      let fetchedProducts = response.data;

      // Si tenemos la ubicación actual, calcular distancias
      fetchedProducts.sort((a, b) => {
        const superA = supermarkets[a.cod_super];
        const superB = supermarkets[b.cod_super];
        const distanceA = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          superA.lat,
          superA.lng
        );
        const distanceB = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          superB.lat,
          superB.lng
        );
        return distanceA - distanceB; // Ordenar de más cercano a más lejano
      });

      // Filtrar por nombre si hay algo escrito en searchName
      if (searchName) {
        fetchedProducts = fetchedProducts.filter((product) =>
          product.nombre.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedSuper, selectedCategory, searchName, currentLocation, supermarkets]);

  useEffect(() => {
    if (!isLoadingLocation && currentLocation) {
      fetchProducts();
    }
  }, [isLoadingLocation, fetchProducts, currentLocation]);

  const handleFavoriteToggle = (product, isFavorite) => {
    setFavorites((prev) => {
      if (isFavorite) return [...prev, product];
      return prev.filter((fav) => fav.id !== product.id);
    });
  };

  return (
    <div className="user-home-container">
      <h1>Productos en descuento</h1>

      {/* Mostrar pantalla de carga mientras estamos esperando la ubicación */}
      {showLoadingScreen ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Cargando ubicación...</p>
        </div>
      ) : (
        <>
          {/* Filtros */}
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

            <div>
              <label htmlFor="searchName">Buscar por Nombre:</label>
              <input
                type="text"
                id="searchName"
                placeholder="Buscar producto..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="product-list">
            {products.map((product) => (
              <Card
                key={product.id}
                product={product}
                supermarket={supermarkets[product.cod_super]?.cadena || "N/A"}
                address={supermarkets[product.cod_super]?.direccion || "N/A"}
                onFavorite={handleFavoriteToggle}
              />
            ))}
          </div>

          <button className="map-button" onClick={() => navigate("/map-screen")}>
            Ver en el Mapa
          </button>
        </>
      )}
    </div>
  );
}
