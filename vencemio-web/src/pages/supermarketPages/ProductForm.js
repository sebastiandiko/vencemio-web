import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./ProductForm.css";

export default function ProductForm() {
  const { superuser } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [porcentajeDescuento, setPorcentajeDescuento] = useState("");
  const [stock, setStock] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [fechaAvisoVencimiento, setFechaAvisoVencimiento] = useState(""); // Campo para la fecha de aviso
  const [imagenURL, setImagenURL] = useState("");
  const [estado, setEstado] = useState(true);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [codigoBarraError, setCodigoBarraError] = useState(""); // Para almacenar el error de código de barras
  const [codigoBarraExistente, setCodigoBarraExistente] = useState(false); // Nuevo estado para saber si el código de barras ya existe
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposProducto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tipos_product");
        setTiposProducto(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de producto:", error);
        alert("No se pudieron cargar los tipos de producto.");
      }
    };
    fetchTiposProducto();
  }, []);


  const handlePrecioDescuentoChange = (value) => {
    setPrecioDescuento(value);
    if (precio) {
      const porcentaje = 100 - (value / precio) * 100;
      setPorcentajeDescuento(porcentaje.toFixed(2));
    }
  };

  
  const handlePorcentajeChange = (value) => {
    setPorcentajeDescuento(value);
    if (precio) {
      const nuevoPrecio = precio - (precio * value) / 100;
      setPrecioDescuento(nuevoPrecio.toFixed(2));
    }
  };

  const validateCodigoBarra = async (value) => {
    // Asegurarse de que sea un número de 13 caracteres
    const regex = /^\d{13}$/;
    if (regex.test(value)) {
      setCodigoBarra(value);
      setCodigoBarraError(""); // Limpiar error si el código es válido
      await checkCodigoBarraExistente(value); // Verificar si el código ya existe
    } else {
      setCodigoBarraError("El código de barra debe ser un número de 13 dígitos.");
      setCodigoBarraExistente(false); // Reiniciar el estado si el formato es incorrecto
    }
  };

  // Función para verificar si el código de barra ya existe
  const checkCodigoBarraExistente = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/productos/byCodSuper/${superuser.cod_super}`);
      const productos = response.data;

      const codigoDuplicado = productos.some((producto) => producto.codigo_barra === codigo);
      if (codigoDuplicado) {
        setCodigoBarraExistente(true); // Código de barra ya existe
        setCodigoBarraError("Este código de barra ya está registrado.");
      } else {
        setCodigoBarraExistente(false); // El código de barra no existe
        setCodigoBarraError(""); // Limpiar error si el código no existe
      }
    } catch (error) {
      console.error("Error al verificar el código de barras:", error);
      alert("No se pudo verificar el código de barra.");
    }
  };

  const handleCodigoBarraChange = (e) => {
    const value = e.target.value;

    // Solo permite números y limita la longitud a 13 caracteres
    if (/^\d*$/.test(value) && value.length <= 13) {
      setCodigoBarra(value);
      setCodigoBarraError(""); // Limpiar error mientras escribe si es válido
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productData = {
      nombre,
      codigo_barra: codigoBarra,
      precio: parseFloat(precio),
      precio_descuento: parseFloat(precioDescuento),
      porcentaje_descuento: parseFloat(porcentajeDescuento),
      stock: parseInt(stock),
      cod_tipo: idTipo,
      cod_super: superuser.cod_super,
      estado,
      fecha_vencimiento: new Date(fechaVencimiento).toISOString(),
      fecha_aviso_vencimiento: parseInt(fechaAvisoVencimiento), // Guardamos el número de días para la alerta
      imagen: imagenURL,
    };

    try {
      await axios.post("http://localhost:5000/api/productos/add", productData);
      alert("Producto agregado exitosamente.");
      navigate("/super-dashboard");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto. Intenta nuevamente.");
    }
  };

  return (
    <div className="productForm-page">
      <div className="product-form-container">
        <h1 className="product-form-title">Agregar Producto</h1>
        <form className="product-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de Barra"
            value={codigoBarra}
            onChange={handleCodigoBarraChange}
            onBlur={() => validateCodigoBarra(codigoBarra)}
            required
          />
          {/* Mostrar el error si el código de barra no es válido o ya existe */}
          {codigoBarraError && <p className="error-message">{codigoBarraError}</p>}

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Porcentaje Descuento"
            value={porcentajeDescuento}
            onChange={(e) => handlePorcentajeChange(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio Descuento"
            value={precioDescuento}
            onChange={(e) => handlePrecioDescuentoChange(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <label>Tipo de Producto:</label>
          <select
            value={idTipo}
            onChange={(e) => setIdTipo(e.target.value)}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposProducto.map((tipo) => (
              <option key={tipo.id} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            required
          />
          {/* Nuevo campo de fecha_aviso_vencimiento */}
          <label>¿Con cuántos días de anticipación desea recibir la alerta?</label>
          <input
            type="number"
            placeholder="Días de anticipación"
            value={fechaAvisoVencimiento}
            onChange={(e) => setFechaAvisoVencimiento(e.target.value)}
            min="1"
            required
          />
          <input
            type="text"
            placeholder="URL de la Imagen"
            value={imagenURL}
            onChange={(e) => setImagenURL(e.target.value)}
          />
          <div className="product-form-switch">
            <label>Estado:</label>
            <input
              type="checkbox"
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
          </div>
          <button type="submit" className="product-form-button">
            Agregar Producto
          </button>
        </form>
      </div>
    </div>
  );
}
