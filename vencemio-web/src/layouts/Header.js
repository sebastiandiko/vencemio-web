import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/LogoVencemio.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Header() {
  const { user, logoutUser } = useUser(); // Accede al usuario autenticado
  const [userType, setUserType] = useState("comprador");
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la ruta actual

  const handleToggle = (type) => {
    setUserType(type);
    if (type === "empresa") {
      navigate("/principal-comercio");
    } else {
      navigate("/principal-comprador");
    }
  };

  const scrollToSection = (id) => {
    localStorage.setItem("sectionToScroll", id);
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogin = () => {
    navigate(userType === "empresa" ? "/login-super" : "/login");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
        <span className="logo-text">VENCEMIO</span>
      </div>
      <nav className="header__nav">
        <button onClick={() => scrollToSection("como-funciona")}>¿Cómo funciona?</button>
        <button onClick={() => scrollToSection("beneficios")}>Beneficios</button>
        <button onClick={() => scrollToSection("partners")}>Partners</button>
        <button onClick={() => scrollToSection("faq")}>Preguntas Frecuentes</button>
        <button onClick={() => scrollToSection("sobre-nosotros")}>Nosotros</button>
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
        {user ? (
          <>
            <div className="header__user-info">
              <span className="header__user-name">Hola, {user.nombre || "Usuario"}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
            {/* Botón para regresar al Dashboard si no estamos en /user-home */}
            {location.pathname !== "/user-home" && (
              <button
                className="btn-back-dashboard"
                onClick={() => navigate("/user-home")}
              >
                Volver al Dashboard
              </button>
            )}
          </>
        ) : (
          <button className="btn-login" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
