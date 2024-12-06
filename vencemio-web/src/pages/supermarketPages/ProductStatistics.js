import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "./ProductStatistics.css";

// Registrar los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ProductStatistics = () => {
  const [products, setProducts] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [discountData, setDiscountData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [supermarketPriceData, setSupermarketPriceData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/productos/");
        const fetchedProducts = response.data;

        setProducts(fetchedProducts);

        // Procesar datos para gráficos
        generatePieData(fetchedProducts);
        generateBarData(fetchedProducts);
        generateDiscountData(fetchedProducts);
        generateStockData(fetchedProducts);
        generateSupermarketPriceData(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const generatePieData = (products) => {
    if (!products || products.length === 0) return;

    const typeCounts = products.reduce((acc, product) => {
      acc[product.cod_tipo] = (acc[product.cod_tipo] || 0) + 1;
      return acc;
    }, {});

    setPieData({
      labels: Object.keys(typeCounts),
      datasets: [
        {
          label: "Distribución por Tipo de Producto",
          data: Object.values(typeCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        },
      ],
    });
  };

  const generateBarData = (products) => {
    if (!products || products.length === 0) return;

    const typePrices = products.reduce((acc, product) => {
      if (!acc[product.cod_tipo]) {
        acc[product.cod_tipo] = { sum: 0, count: 0 };
      }
      acc[product.cod_tipo].sum += parseFloat(product.precio);
      acc[product.cod_tipo].count += 1;
      return acc;
    }, {});

    const types = Object.keys(typePrices);
    const averages = types.map((type) => typePrices[type].sum / typePrices[type].count);

    setBarData({
      labels: types,
      datasets: [
        {
          label: "Promedio de Precios por Tipo",
          data: averages,
          backgroundColor: "#36A2EB",
        },
      ],
    });
  };

  const generateDiscountData = (products) => {
    if (!products || products.length === 0) return;

    const discountCounts = products.reduce((acc, product) => {
      const discountRange = `${Math.floor(product.porcentaje_descuento / 10) * 10}% - ${Math.ceil(product.porcentaje_descuento / 10) * 10}%`;
      acc[discountRange] = (acc[discountRange] || 0) + 1;
      return acc;
    }, {});

    setDiscountData({
      labels: Object.keys(discountCounts),
      datasets: [
        {
          label: "Distribución de Productos por Descuento",
          data: Object.values(discountCounts),
          backgroundColor: ["#FF5733", "#FF8D1A", "#FFC300", "#28A745", "#1E90FF"],
        },
      ],
    });
  };

  const generateStockData = (products) => {
    if (!products || products.length === 0) return;

    const typeStock = products.reduce((acc, product) => {
      acc[product.cod_tipo] = (acc[product.cod_tipo] || 0) + product.stock;
      return acc;
    }, {});

    setStockData({
      labels: Object.keys(typeStock),
      datasets: [
        {
          label: "Total de Stock por Tipo de Producto",
          data: Object.values(typeStock),
          backgroundColor: "#FF9F40",
        },
      ],
    });
  };

  const generateSupermarketPriceData = (products) => {
    if (!products || products.length === 0) return;

    const supermarketPrices = products.reduce((acc, product) => {
      if (!acc[product.cod_super]) {
        acc[product.cod_super] = { sum: 0, count: 0 };
      }
      acc[product.cod_super].sum += parseFloat(product.precio);
      acc[product.cod_super].count += 1;
      return acc;
    }, {});

    const supermarkets = Object.keys(supermarketPrices);
    const averagePrices = supermarkets.map(
      (supermarket) => supermarketPrices[supermarket].sum / supermarketPrices[supermarket].count
    );

    setSupermarketPriceData({
      labels: supermarkets,
      datasets: [
        {
          label: "Promedio de Precios por Supermercado",
          data: averagePrices,
          backgroundColor: "#36A2EB",
        },
      ],
    });
  };

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Estadísticas de Productos</h1>

      <div className="chart-section">
        <h2 className="chart-title">Distribución por Tipo de Producto</h2>
        <div className="chart-wrapper">
          {pieData ? <Pie data={pieData} /> : <p>Cargando datos...</p>}
        </div>
      </div>

      <div className="chart-section">
        <h2 className="chart-title">Promedio de Precios por Tipo</h2>
        <div className="chart-wrapper">
          {barData ? <Bar data={barData} /> : <p>Cargando datos...</p>}
        </div>
      </div>

      <div className="chart-section">
        <h2 className="chart-title">Distribución de Productos por Descuento</h2>
        <div className="chart-wrapper">
          {discountData ? <Pie data={discountData} /> : <p>Cargando datos...</p>}
        </div>
      </div>


      <div className="chart-section">
        <h2 className="chart-title">Promedio de Precios por Supermercado</h2>
        <div className="chart-wrapper">
          {supermarketPriceData ? <Bar data={supermarketPriceData} /> : <p>Cargando datos...</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductStatistics;
