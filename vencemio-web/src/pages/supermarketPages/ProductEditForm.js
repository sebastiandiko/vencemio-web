import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ProductEditForm.css";

export default function ProductEditForm() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [tiposProducto, setTiposProducto] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id}`);
        const fetchedProduct = response.data;

        // Ajustar formato de fecha para el input `date`
        if (fetchedProduct.fecha_vencimiento) {
          fetchedProduct.fecha_vencimiento = fetchedProduct.fecha_vencimiento.substr(0, 10);
        }

        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        alert("No se pudo cargar el producto.");
      }
    };

    const fetchTiposProducto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tipos_product");
        setTiposProducto(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de producto:", error);
        alert("No se pudieron cargar los tipos de producto.");
      }
    };

    fetchProduct();
    fetchTiposProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      fecha_vencimiento: product.fecha_vencimiento, // No transformar a ISO
    };

    try {
      await axios.put(`http://localhost:5000/api/productos/${id}`, updatedProduct);
      alert("Producto actualizado exitosamente.");
      navigate("/super-dashboard");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  return (
    <div className="product-edit-form-page">
      <div className="product-edit-form-container">
        <h1 className="product-edit-form-title">Editar Producto</h1>
        <form className="product-edit-form" onSubmit={handleUpdateProduct}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={product.nombre || ""}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="codigo_barra"
            placeholder="Código de Barra"
            value={product.codigo_barra || ""}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={product.precio || ""}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio_descuento"
            placeholder="Precio Descuento"
            value={product.precio_descuento || ""}
            onChange={handleChange}
          />
          <input
            type="number"
            name="porcentaje_descuento"
            placeholder="Porcentaje Descuento"
            value={product.porcentaje_descuento || ""}
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock || ""}
            onChange={handleChange}
            required
          />
          <label>Tipo de Producto:</label>
          <select
            name="cod_tipo"
            value={product.cod_tipo || ""}
            onChange={handleChange}
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
            name="fecha_vencimiento"
            value={product.fecha_vencimiento || ""}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de la Imagen"
            value={product.imagen || ""}
            onChange={handleChange}
          />
          <div className="product-edit-form-switch">
            <label>Estado:</label>
            <input
              type="checkbox"
              name="estado"
              checked={product.estado || false}
              onChange={(e) => setProduct({ ...product, estado: e.target.checked })}
            />
          </div>
          <button type="submit" className="product-edit-form-button">
            Actualizar Producto
          </button>
        </form>
      </div>
    </div>
  );
}
