import React, { useEffect, useState } from "react";
import "./Header.css"; // Archivo CSS para estilos

function Header() {
  const [userType, setUserType] = useState("comprador"); // Estado para el tipo de usuario

  // Función para alternar entre empresas y compradores
  const handleToggle = (type) => {
    setUserType(type); // Actualiza el estado del tipo de usuario
  };

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    if (userType === "empresa") {
      window.location.href = "/login-super"; // Redirige al login de empresas
    } else {
      window.location.href = "/login"; // Redirige al login de compradores
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
        <img src="https://via.placeholder.com/100x30" alt="Logo" />
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
          className={`header__toggle-btn ${userType === "empresa" ? "active" : ""}`}
          onClick={() => handleToggle("empresa")}
        >
          Para empresas
        </button>
        <button
          className={`header__toggle-btn ${userType === "comprador" ? "active" : ""}`}
          onClick={() => handleToggle("comprador")}
        >
          Para compradores
        </button>
      </div>
      <div className="header__actions">
        <button className="btn-login" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <button className="btn-contact">Contacto</button>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
        <span>English</span>
      </div>
    </header>
  );
}

export default Header;
