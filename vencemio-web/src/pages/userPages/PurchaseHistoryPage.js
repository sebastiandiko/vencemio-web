import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import "./PurchaseHistoryPage.css";

const PurchaseHistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]); // Filtrado por tiempo
  const [products, setProducts] = useState({});
  const [supermarkets, setSupermarkets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // Default: todos

  const { user } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!userUid) {
        setError("Usuario no autenticado.");
        setLoading(false);
        return;
      }

      try {
        const [historyRes, productsRes, supermarketsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/ventas/history/${userUid}`),
          fetch("http://localhost:5000/api/productos"),
          fetch("http://localhost:5000/api/superusers"),
        ]);

        if (!historyRes.ok || !productsRes.ok || !supermarketsRes.ok) {
          throw new Error("Error al obtener los datos.");
        }

        const [historyData, productsData, supermarketsData] = await Promise.all([
          historyRes.json(),
          productsRes.json(),
          supermarketsRes.json(),
        ]);

        setPurchaseHistory(historyData);
        setFilteredHistory(historyData);

        const productMap = {};
        productsData.forEach((product) => {
          productMap[product.id] = {
            nombre: product.nombre,
            imagen: product.imagen,
          };
        });
        setProducts(productMap);

        const supermarketMap = {};
        supermarketsData.forEach((supermarket) => {
          supermarketMap[supermarket.cod_super] = {
            cadena: supermarket.cadena,
            direccion: `${supermarket.direccion}, ${supermarket.ciudad}`,
          };
        });
        setSupermarkets(supermarketMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userUid]);

  // Filtrar por tiempo
  useEffect(() => {
    const now = new Date();
    let filtered;

    switch (filter) {
      case "week":
        filtered = purchaseHistory.filter((purchase) => {
          const date = new Date(purchase.fecha);
          return (now - date) / (1000 * 60 * 60 * 24) <= 7;
        });
        break;
      case "month":
        filtered = purchaseHistory.filter((purchase) => {
          const date = new Date(purchase.fecha);
          return now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();
        });
        break;
      case "three-months":
        filtered = purchaseHistory.filter((purchase) => {
          const date = new Date(purchase.fecha);
          return (now - date) / (1000 * 60 * 60 * 24) <= 90;
        });
        break;
      default:
        filtered = purchaseHistory;
    }

    setFilteredHistory(filtered);
  }, [filter, purchaseHistory]);

  if (loading) return <p className="loading">Cargando historial de compras...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="purchase-history-page">
      <h1 className="page-title">Historial de Compras</h1>

      {/* Filtros por tiempo */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
          Todas
        </button>
        <button onClick={() => setFilter("week")} className={filter === "week" ? "active" : ""}>
          Última Semana
        </button>
        <button onClick={() => setFilter("month")} className={filter === "month" ? "active" : ""}>
          Último Mes
        </button>
        <button
          onClick={() => setFilter("three-months")}
          className={filter === "three-months" ? "active" : ""}
        >
          Últimos 3 Meses
        </button>
      </div>

      {/* Lista de compras */}
      <div className="purchase-container">
        {filteredHistory.map((purchase) => {
          const product = products[purchase.producto_id] || {};
          const supermarket = supermarkets[purchase.cod_super] || {};

          return (
            <div key={purchase.id} className="purchase-card small-card">
              <img
                src={product.imagen || "default-placeholder.png"}
                alt={product.nombre || "Producto"}
                className="purchase-image"
              />
              <div className="purchase-details">
                <h3 className="product-name">{product.nombre || "Producto desconocido"}</h3>
                <p>
                  <strong>Supermercado:</strong> {supermarket.cadena || "Desconocido"}
                </p>
                <p>
                  <strong>Dirección:</strong> {supermarket.direccion || "N/A"}
                </p>
                <p>
                  <strong>Cantidad:</strong> {purchase.cantidad}
                </p>
                <p>
                  <strong>Total:</strong> ${purchase.total.toFixed(2)}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
