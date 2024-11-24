import React from "react";
import "./PrincipalPageComprador.css"; // Archivo CSS para estilos

function PrincipalPageComprador() {
  return (
    <div className="home-page">
      {/* Sección 1: ¿Cómo funciona? */}
      <section id="como-funciona" className="section">
        <h2>¿Cómo funciona?</h2>
        <p>Explicación sobre cómo funciona la plataforma.</p>
      </section>

      {/* Sección 2: Proceso */}
      <section id="proceso" className="section">
        <h2>Proceso</h2>
        <p>Descripción del proceso para usar la plataforma.</p>
      </section>

      {/* Sección 3: Beneficios */}
      <section id="beneficios" className="section">
        <h2>Beneficios</h2>
        <p>Razones por las que los usuarios deberían usar esta plataforma.</p>
      </section>

      {/* Sección 4: Partners */}
      <section id="partners" className="section">
        <h2>Partners</h2>
        <p>Información sobre socios y colaboradores.</p>
      </section>

      {/* Sección 5: Preguntas Frecuentes */}
      <section id="preguntas-frecuentes" className="section">
        <h2>Preguntas Frecuentes</h2>
        <p>Respuestas a preguntas comunes de los usuarios.</p>
      </section>

      {/* Sección 6: Nosotros */}
      <section id="nosotros" className="section">
        <h2>Nosotros</h2>
        <p>Información sobre la empresa o el proyecto.</p>
      </section>
    </div>
  );
}

export default PrincipalPageComprador;
