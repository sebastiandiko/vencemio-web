import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import CardSuper from "../../components/Card/CardSuper";
import "./SuperDashboard.css";

export default function SuperDashboard() {
  const { logout, superuser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [expiringProducts, setExpiringProducts] = useState([]); // Productos que están cerca del vencimiento
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    if (!superuser) {
      alert("Por favor, inicie sesión.");
      navigate("/login-super");
    }
  }, [superuser, navigate]);

  // Fetch de productos
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/productos/byCodSuper/${superuser.cod_super}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      checkExpiringProducts(response.data); // Comprobar productos con vencimiento cercano
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch de categorías
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tipos_product");
      setCategories(response.data.map((category) => category.nombre)); // Usamos "nombre" en lugar de "codigo"
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    if (superuser) {
      fetchProducts();
      fetchCategories();
    }
  }, [superuser]);

  // Filtrar productos por categoría
  const handleFilterCategory = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category) {
      const filtered = products.filter(
        (product) =>
          product.cod_tipo?.toLowerCase().trim() === category.toLowerCase().trim()
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Mostrar todos si no hay categoría seleccionada
    }
  };

  const handleAddProduct = () => {
    navigate("/product-form");
  };

  // Función para manejar la eliminación del producto
  const handleDeleteProduct = async (id) => {
    try {
      // Hacer la solicitud DELETE al backend
      await axios.delete(`http://localhost:5000/api/productos/${id}`);
  
      // Eliminar el producto de la lista local (optimistic update)
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setFilteredProducts((prevFiltered) =>
        prevFiltered.filter((product) => product.id !== id)
      );
  
      alert("Producto eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Hubo un problema al eliminar el producto.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login-super");
  };

  // Función para calcular productos cercanos al vencimiento
  const checkExpiringProducts = (products) => {
    const currentDate = new Date();
    const expiringSoon = products.filter((product) => {
      const avisoDate = new Date(product.fecha_avisado);
      return avisoDate <= currentDate; // Productos cuya fecha de aviso es hoy o en el pasado
    });
    setExpiringProducts(expiringSoon);
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard del Supermercado</h1>

      {/* Filtro por categoría */}
      <div className="controls">
        <label htmlFor="categoryFilter">Filtrar por categoría:</label>
        <select
          id="categoryFilter"
          className="filter-select"
          value={selectedCategory}
          onChange={handleFilterCategory}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAddProduct} className="add-product-button">
        Agregar Producto
      </button>

      {/* Mostrar alerta para productos con vencimiento cercano */}
      {expiringProducts.length > 0 && (
        <div className="expiring-alert">
          <h2>¡Alerta de Vencimiento!</h2>
          <p>{expiringProducts.length} productos están próximos a vencer. ¡Revísalos!</p>
          <div className="expiring-product-list">
            {expiringProducts.map((product) => (
              <CardSuper
                key={product.id}
                product={product}
                onEdit={() => navigate(`/edit-product/${product.id}`)}
                onDelete={() => handleDeleteProduct(product.id)} // Llamamos a handleDeleteProduct para eliminar
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardSuper
              key={product.id}
              product={product}
              onEdit={() => navigate(`/edit-product/${product.id}`)}
              onDelete={() => handleDeleteProduct(product.id)} // Llamamos a handleDeleteProduct para eliminar
            />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>

      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
}
