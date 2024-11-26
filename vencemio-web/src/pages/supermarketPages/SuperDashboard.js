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

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/productos/${id}`);
      alert("Producto eliminado exitosamente.");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setFilteredProducts((prevFiltered) =>
        prevFiltered.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Hubo un problema al eliminar el producto.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login-super");
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

      {/* Lista de productos */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardSuper
              key={product.id}
              product={product}
              onEdit={() => navigate(`/edit-product/${product.id}`)}
              onDelete={() => handleDeleteProduct(product.id)}
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
