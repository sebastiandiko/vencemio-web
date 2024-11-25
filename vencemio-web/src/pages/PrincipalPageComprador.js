import React from "react";
import "./PrincipalPageComprador.css"; // Estilos globales
import Benefits from "../components/Benefits/Users/Benefits"; // Sección de Beneficios
import AboutUs from "../components/AboutUs/AboutUs";
import FAQ from "../components/FAQ/Users/FAQ";
import PartnersCarousel from "../components/PartnersCarousel/PartnersCarousel";
import HowItWorks from "../components/HowWorks/HowItWorks";
function PrincipalPageComprador() {
  return (
    <div className="home-page">
      {/* Sección: ¿Cómo funciona? */}
      <HowItWorks />

      {/* Sección: Beneficios */}
      <Benefits />

      {/* Sección: Partners */}
      <PartnersCarousel/>
      
      {/* Sección: Preguntas Frecuentes */}
      <FAQ />

      {/* Sección: Nosotros */}
      <AboutUs />
    </div>
  );
}

export default PrincipalPageComprador;
