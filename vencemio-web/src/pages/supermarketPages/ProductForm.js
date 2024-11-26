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
  const [imagenURL, setImagenURL] = useState("");
  const [estado, setEstado] = useState(true);
  const [tiposProducto, setTiposProducto] = useState([]);
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
            onChange={(e) => setCodigoBarra(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio Descuento"
            value={precioDescuento}
            onChange={(e) => handlePrecioDescuentoChange(e.target.value)}
          />
          <input
            type="number"
            placeholder="Porcentaje Descuento"
            value={porcentajeDescuento}
            onChange={(e) => handlePorcentajeChange(e.target.value)}
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
