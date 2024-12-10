import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CompraPage.css"; // Importa el archivo CSS

const CompraPage = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null); // Estado para almacenar los detalles del producto
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState(null); // Estado para manejar errores
  const [isProcessing, setIsProcessing] = useState(false); // Estado para manejar el procesamiento de la compra

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/productos/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    if (!product) return;

    setIsProcessing(true); // Inicia el estado de procesamiento
    try {
      const orderData = {
        cantidad: 1, // Por ahora, seleccionamos una cantidad fija
        producto_id: id,
        user_id: "user123", // Cambia esto con el ID real del usuario logueado
        forma_pago: "Efectivo", // Forma de pago fija por ahora
      };

      const response = await fetch("http://localhost:5000/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la orden de compra");
      }

      const data = await response.json();
      alert("¡Orden de compra creada exitosamente!");
      console.log("Orden de compra:", data);
    } catch (err) {
      console.error(err.message);
      alert("Hubo un error al procesar la compra. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false); // Finaliza el estado de procesamiento
    }
  };

  if (loading) {
    return <p className="loading">Cargando detalles del producto...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="compra-page">
      <h1 className="compra-title">Compra del Producto</h1>
      {product ? (
        <div className="product-container">
          <img
            src={product.imagen || "/default-image.jpg"}
            alt={product.nombre}
            className="product-image"
          />
          <div className="product-details">
            <h2 className="product-name">{product.nombre}</h2>
            <p className="product-price">
              Precio: <span>${product.precio}</span>
            </p>
            <p className="product-discount-price">
              Precio con descuento: <span>${product.precio_descuento}</span>
            </p>
            <p className="product-description">
              Descripción: {product.descripcion || "No disponible"}
            </p>
            <p className="product-stock">Stock disponible: {product.stock}</p>
            <button
              className="buy-button"
              onClick={handleBuy}
              disabled={isProcessing} // Desactiva el botón mientras se procesa
            >
              {isProcessing ? "Procesando..." : "Proceder con la compra"}
            </button>
          </div>
        </div>
      ) : (
        <p className="not-found">Producto no encontrado.</p>
      )}
    </div>
  );
};

export default CompraPage;
