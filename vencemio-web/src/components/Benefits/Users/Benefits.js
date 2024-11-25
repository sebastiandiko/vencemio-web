import React from "react";
import "./Benefits.css"; // Archivo CSS para los estilos

function Benefits() {
  return (
    <section id="beneficios" className="benefits-section">
      <h2 className="benefits-title">Beneficios de Usar Vencemio</h2>
      <p className="benefits-subtitle">
        Una solución que beneficia a todos: consumidores, supermercados y el medio ambiente.
      </p>

      <div className="benefits-container">
        {/* Beneficios para los Consumidores */}
        <div className="benefit">
          <h3 className="benefit-title">Ahorra mientras cuidas tu bolsillo</h3>
          <ul className="benefit-list">
            <li>Ahorro garantizado: Encuentra productos con descuentos significativos, desde un 20% hasta un 60%.</li>
            <li>Calidad asegurada: Todos los productos están en perfecto estado para el consumo.</li>
            <li>Practicidad: Encuentra ofertas en supermercados cercanos o recibe notificaciones personalizadas.</li>
          </ul>
          <div className="benefit-visual">💰</div>
        </div>

        {/* Beneficios para los Supermercados */}
        <div className="benefit">
          <h3 className="benefit-title">Reduce pérdidas y mejora tu imagen</h3>
          <ul className="benefit-list">
            <li>Gestión eficiente del inventario: Reduce el desperdicio de productos próximos a vencer.</li>
            <li>Aumenta tus ingresos: Genera ganancias de productos que normalmente serían desechados.</li>
            <li>Responsabilidad social: Mejora tu reputación promoviendo prácticas sostenibles.</li>
          </ul>
          <div className="benefit-visual">📈</div>
        </div>

        {/* Beneficios para el Medio Ambiente */}
        <div className="benefit">
          <h3 className="benefit-title">Juntos por un planeta más sostenible</h3>
          <ul className="benefit-list">
            <li>Menos desperdicio: Ayuda a reducir toneladas de alimentos desechados.</li>
            <li>Impacto ambiental reducido: Menos desperdicio significa menos emisiones de gases de efecto invernadero.</li>
            <li>Promoción de economía circular: Contribuye a un sistema de consumo más responsable.</li>
          </ul>
          <div className="benefit-visual">🌍</div>
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="benefits-cta">
        <p>Con Vencemio, todos ganamos.</p>
        <button className="cta-button">Únete Ahora</button>
      </div>
    </section>
  );
}

export default Benefits;
