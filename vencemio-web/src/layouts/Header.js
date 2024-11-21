import React from "react";
import { useNavigate } from "react-router-dom"; // Hook para la navegación
import "./Header.css"; // Estilos del Header

function Header() {
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleLoginClick = () => {
    navigate("/login"); // Navega a la ruta de inicio de sesión
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src="https://via.placeholder.com/100x30" alt="Logo" />
      </div>
      <nav className="header__nav">
        <a href="#como-funciona">¿Cómo funciona?</a>
        <a href="#proceso">Proceso</a>
        <a href="#impacto">Impacto</a>
        <a href="#preguntas">Preguntas</a>
      </nav>
      <div className="header__actions">
        <button className="btn-download">Descargar</button>
        <button className="btn-login" type="button" onClick={handleLoginClick}>
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
