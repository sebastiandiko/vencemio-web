import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto
import axios from "axios";
import "./SuperDashboard.css";

export default function SuperDashboard() {
  const { logout, superuser } = useContext(AuthContext); // Accede al contexto
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validar si el usuario está autenticado
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
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (superuser) {
      fetchProducts();
    }
  }, [superuser]);

  // Función para agregar un producto
  const handleAddProduct = () => {
    navigate("/product-form");
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/productos/${id}`);
      alert("Producto eliminado exitosamente.");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
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

  // Render de productos con el botón Editar
  const renderProduct = (product) => (
    <div key={product.id} className="product-item">
      <h3>{product.nombre}</h3>
      <p>Precio: ${product.precio}</p>
      <p>Stock: {product.stock}</p>
      <p>Código de Barra: {product.codigo_barra}</p>
      <button
        className="edit-button"
        onClick={() => navigate(`/edit-product/${product.id}`)} // Redirige al formulario de edición
      >
        Editar
      </button>
      <button
        className="delete-button"
        onClick={() => handleDeleteProduct(product.id)} // Manejar eliminación
      >
        Eliminar
      </button>
    </div>
  );

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div>
      <h1>Dashboard del Supermercado</h1>
      <button onClick={handleAddProduct} className="add-product-button">
        Agregar Producto
      </button>
      <div className="product-list">
        {products.length > 0
          ? products.map(renderProduct)
          : "No hay productos disponibles."}
      </div>
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
}
