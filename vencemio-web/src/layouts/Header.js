import React, { useEffect, useState } from "react";
import "./Header.css"; // Archivo CSS para estilos
import logo from "../assets/LogoVencemio.png"; // Ya lo tienes correctamente
import { useNavigate } from "react-router-dom"; // Para manejar rutas en React Router

function Header() {
  const [userType, setUserType] = useState("comprador"); // Estado para el tipo de usuario
  const navigate = useNavigate(); // Hook para navegación

  // Función para alternar entre empresas y compradores
  const handleToggle = (type) => {
    setUserType(type); // Actualiza el estado del tipo de usuario

    // Redirige según el tipo de usuario
    if (type === "empresa") {
      navigate("/principal-comercio"); // Redirige a la página principal de comercio
    } else if (type === "comprador") {
      navigate("/principal-comprador"); // Redirige a la página principal del comprador
    }
  };

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    if (userType === "empresa") {
      navigate("/login-super"); // Redirige al login de empresas
    } else {
      navigate("/login"); // Redirige al login de compradores
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".header__nav a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href").substring(1) === entry.target.id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.5 } // Cambiar al 50% de visibilidad
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Logo" className="logo" />
        <span className="logo-text">VENCEMIO</span>
      </div>
      <nav className="header__nav">
        <a href="#como-funciona">¿Cómo funciona?</a>
        <a href="#beneficios">Beneficios</a>
        <a href="#partners">Partners</a>
        <a href="#faq">Preguntas Frecuentes</a>
        <a href="#sobre-nosotros">Nosotros</a>
      </nav>
      <div className="header__toggle">
        <button
          className={`header__toggle-btn ${userType === "comprador" ? "active" : ""}`}
          onClick={() => handleToggle("comprador")}
        >
          Comprador
        </button>
        <button
          className={`header__toggle-btn ${userType === "empresa" ? "active" : ""}`}
          onClick={() => handleToggle("empresa")}
        >
          Empresa
        </button>
      </div>
      <div className="header__actions">
        <button className="btn-login" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
