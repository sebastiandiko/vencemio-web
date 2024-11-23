import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Navegación en React Router
import axios from "axios";
import "./UserHome.css"; // Archivo CSS para estilos

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState([]);
  const [supermercados, setSupermercados] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedSuper, setSelectedSuper] = useState("");
  const navigate = useNavigate();

  // Variable temporal para la fecha actual
  const currentDate = new Date();

  // Obtener tipos de producto y supermercados
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Obtener tipos de producto
        const tiposResponse = await axios.get("http://localhost:5000/api/tipos_product");
        setTipos(tiposResponse.data.map((tipo) => tipo.nombre)); // Asegurar que sea un array de strings

        // Obtener supermercados
        const supermercadosResponse = await axios.get("http://localhost:5000/api/superusers");
        setSupermercados(
          supermercadosResponse.data.map((supermercado) => supermercado.cadena) // Obtener los nombres
        );
      } catch (error) {
        console.error("Error al obtener filtros:", error);
        alert("No se pudieron cargar los filtros.");
      }
    };

    fetchFilters();
  }, []);

  // Obtener productos filtrados
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/productos";
      if (selectedTipo && selectedSuper) {
        url += `?tipo=${selectedTipo}&super=${selectedSuper}`;
      } else if (selectedTipo) {
        url += `?tipo=${selectedTipo}`;
      } else if (selectedSuper) {
        url += `?super=${selectedSuper}`;
      }

      const response = await axios.get(url);
      setProducts(response.data);

      checkForExpiringProducts(response.data); // Verificar productos próximos a vencer
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, [selectedTipo, selectedSuper]);

  // Verificar productos próximos a vencer
  const checkForExpiringProducts = (productos) => {
    const soonToExpireProducts = productos.filter((product) => {
      const expirationDate = new Date(product.fecha_vencimiento);
      const diffTime = expirationDate - currentDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 3;
    });

    if (soonToExpireProducts.length > 0) {
      soonToExpireProducts.forEach((product) => {
        alert(`El producto ${product.nombre} está próximo a vencer.`);
      });
    }
  };

  // Efecto para cargar productos al cambiar los filtros
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="user-home-container">
      <h1>Productos en descuento cerca de ti</h1>

      <div className="filters">
        <div>
          <label htmlFor="tipo">Filtrar por Tipo de Producto:</label>
          <select
            id="tipo"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tipos.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="super">Filtrar por Supermercado:</label>
          <select
            id="super"
            value={selectedSuper}
            onChange={(e) => setSelectedSuper(e.target.value)}
          >
            <option value="">Todos los supermercados</option>
            {supermercados.map((supermercado, index) => (
              <option key={index} value={supermercado}>
                {supermercado}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <h3>{product.nombre}</h3>
            <p>Precio: ${product.precio}</p>
            <p>Vence el: {new Date(product.fecha_vencimiento).toLocaleDateString()}</p>
            <button onClick={() => navigate(`/product-detail/${product.id}`)}>
              Ver Detalles
            </button>
          </div>
        ))}
      </div>

      <button className="map-button" onClick={() => navigate("/map-screen")}>
        Ver en el Mapa
      </button>
    </div>
  );
}
