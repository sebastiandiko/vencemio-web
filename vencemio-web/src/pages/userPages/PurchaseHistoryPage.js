import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext"; // Acceso al contexto del usuario
import "./PurchaseHistoryPage.css"; // Archivo CSS para estilos

const PurchaseHistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]); // Historial de compras
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  const { user } = useUser(); // Obtener datos del usuario
  const userUid = user?.uid; // UID del usuario

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!userUid) {
        setError("Usuario no autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/ventas/history/${userUid}`);
        if (!response.ok) {
          throw new Error("Error al obtener el historial de compras.");
        }
        const data = await response.json();
        setPurchaseHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userUid]);

  if (loading) {
    return <p className="loading">Cargando historial de compras...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="purchase-history-page">
      <h1>Historial de Compras</h1>
      {purchaseHistory.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <div className="purchase-history-container">
          {purchaseHistory.map((purchase) => (
            <div key={purchase.id} className="purchase-item">
              <p><strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString()}</p>
              <p><strong>Producto:</strong> {purchase.producto_id}</p>
              <p><strong>Supermercado:</strong> {purchase.cod_super}</p>
              <p><strong>Cantidad:</strong> {purchase.cantidad}</p>
              <p><strong>Total:</strong> ${purchase.total.toFixed(2)}</p>
              <p><strong>Forma de Pago:</strong> {purchase.forma_pago}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;
