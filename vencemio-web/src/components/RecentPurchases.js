import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "./RecentPurchases.css";

const RecentPurchases = () => {
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ventas/recent/${userUid}`);
        if (!response.ok) {
          throw new Error("Error al obtener las compras recientes.");
        }
        const data = await response.json();
        setRecentPurchases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchRecentPurchases();
    }
  }, [userUid]);

  if (loading) {
    return <p className="loading">Cargando tus compras recientes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (recentPurchases.length === 0) {
    return <p className="no-purchases">No tienes compras recientes.</p>;
  }

  return (
    <div className="recent-purchases">
      <h2>Tus Compras Recientes</h2>
      <ul>
        {recentPurchases.map((purchase) => (
          <li key={purchase.id} className="purchase-item">
            <p>Producto: {purchase.producto_id}</p>
            <p>Cantidad: {purchase.cantidad}</p>
            <p>Total: ${purchase.total.toFixed(2)}</p>
            <p>Fecha: {new Date(purchase.fecha).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      <Link to="/historial-compras" className="view-all">
        Ver todo el historial
      </Link>
    </div>
  );
};

export default RecentPurchases;
