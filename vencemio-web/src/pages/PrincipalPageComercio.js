import React from "react";
import "./PrincipalPageComprador.css"; // Estilos globales
import BenefitsForBusiness from "../components/Benefits/Supers/BenefitsSuper"; // Sección de Beneficios
import AboutUs from "../components/AboutUs/AboutUs";
import FAQ from "../components/FAQ/Supers/FAQSuper";
import PartnersCarousel from "../components/PartnersCarousel/PartnersCarousel";
import HowItWorksForBusinesses from "../components/HowWorks/HowItWorksSupers";

function PrincipalPageComercio() {
  return (
    <div className="home-page">
      {/* Sección: ¿Cómo funciona? */}
      <HowItWorksForBusinesses />

      {/* Sección: Beneficios */}
      <BenefitsForBusiness />

      {/* Sección: Partners */}
      <PartnersCarousel/>
      
      {/* Sección: Preguntas Frecuentes */}
      <FAQ />

      {/* Sección: Nosotros */}
      <AboutUs />
    </div>
  );
}

export default PrincipalPageComercio;
