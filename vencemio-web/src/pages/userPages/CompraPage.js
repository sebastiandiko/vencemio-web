import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { jsPDF } from "jspdf";
import "./CompraPage.css";

const CompraPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [superuserDetails, setSuperuserDetails] = useState(null);
  const [userData, setUserData] = useState(null);

  const { user, isAuthenticated } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchProductAndUser = async () => {
      try {
        // Obtener datos del producto
        const productResponse = await fetch(`http://localhost:5000/api/productos/${id}`);
        if (!productResponse.ok) {
          throw new Error('Error al obtener el producto');
        }
        const productData = await productResponse.json();
        setProduct(productData);
  
        // Obtener detalles del supermercado
        const superuserResponse = await fetch(
          `http://localhost:5000/api/superusers/cod_super/${productData.cod_super}`
        );
        if (superuserResponse.ok) {
          const superuserData = await superuserResponse.json();
          setSuperuserDetails(superuserData);
        }
  
        // Obtener datos del usuario
        if (userUid) {
          const userResponse = await fetch(`http://localhost:5000/api/users/uid/${userUid}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData(userData); // Guardar datos del usuario en el estado
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductAndUser();
  }, [id, userUid]);
  

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= product.stock) {
      setCantidad(value);
    } else if (value > product.stock) {
      alert("La cantidad no puede superar el stock disponible.");
    }
  };

  const handleBuy = async () => {
    if (!product || !userUid || cantidad <= 0 || cantidad > product.stock) {
      alert("Por favor selecciona una cantidad válida.");
      return;
    }
  
    setIsProcessing(true);
    try {
      const orderData = {
        cantidad,
        producto_id: id,
        user_id: userUid,
        forma_pago: "Efectivo",
      };
  
      console.log("Datos enviados al backend:", orderData);
  
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
  
      const total = product.precio_descuento * cantidad;
      const orderNumber = generateOrderNumber(userUid, id);
  
      // Construir el nombre completo del comprador
      const buyerName = userData
        ? `${userData.nombre || "N/A"} ${userData.apellido || ""}`
        : "Usuario no registrado";
  
      alert("¡Orden de compra creada exitosamente!");
      console.log("Orden de compra:", data);
  
      // Generar el PDF después de una compra exitosa
      generatePDF(orderData, total, orderNumber, buyerName, superuserDetails);
    } catch (err) {
      console.error(err.message);
      alert("Hubo un error al procesar la compra. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const generateOrderNumber = (userUid, productId) => {
    const timestamp = new Date().getTime();
    return `ORD-${productId}-${userUid}-${timestamp}`;
  };

  const generatePDF = (orderData, total, orderNumber, buyerName = "N/A", superuser = {}) => {
    const doc = new jsPDF();
  
    // Encabezado
    doc.setFontSize(18);
    doc.text("Orden de Compra", 10, 10);
    doc.setFontSize(12);
    doc.text(`Tienda: ${superuser.cadena || "N/A"}`, 10, 20);
    doc.text(`Dirección: ${superuser.direccion || "N/A"}`, 10, 30);
    doc.text(`Teléfono: ${superuser.telefono || "N/A"}`, 10, 40);
    doc.text(`Número de Orden: ${orderNumber}`, 10, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 60);
  
    // Datos del comprador
    doc.text("Datos del Comprador:", 10, 80);
    doc.text(`Nombre: ${buyerName}`, 10, 90); // Se pasa el nombre completo del comprador
    doc.text(`Usuario ID: ${orderData.user_id || "N/A"}`, 10, 100);
  
    // Detalles de la compra
    doc.text("Detalles de la Compra:", 10, 120);
    doc.text(`Producto: ${product.nombre || "N/A"}`, 10, 130);
    doc.text(`Cantidad: ${orderData.cantidad}`, 10, 140);
    doc.text(`Precio unitario: $${product.precio_descuento.toFixed(2) || "0.00"}`, 10, 150);
    doc.text(`Total: $${total.toFixed(2)}`, 10, 160);
  
    // Forma de pago
    doc.text("Forma de Pago:", 10, 180);
    doc.text(`Método: ${orderData.forma_pago || "N/A"}`, 10, 190);
  
    // Notas adicionales
    doc.text("Gracias por su compra. Guarde esta orden como comprobante.", 10, 210);
  
    // Guardar el archivo
    doc.save(`orden_compra_${orderNumber}.pdf`);
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
              Precio unitario: <span>${product.precio.toFixed(2)}</span>
            </p>
            <p className="product-discount-price">
              Precio con descuento: <span>${product.precio_descuento.toFixed(2)}</span>
            </p>
            <div className="product-quantity">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                value={cantidad}
                onChange={handleCantidadChange}
                min="1"
              />
            </div>
            <p className="product-stock">Stock disponible: {product.stock}</p>
            <p className="product-total">
              Total: <span>${(product.precio_descuento * cantidad).toFixed(2)}</span>
            </p>
            <button
              className="buy-button"
              onClick={handleBuy}
              disabled={isProcessing || cantidad <= 0 || cantidad > product.stock}
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
