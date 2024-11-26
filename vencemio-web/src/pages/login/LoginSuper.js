import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto
import "./LoginSuper.css"; // Archivo CSS para estilos

function LoginSuper() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();
  const { setSuperuser } = useContext(AuthContext); // Accede al contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login-super", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, super: superData } = response.data;
        localStorage.setItem("super_token", token);
        setSuperuser(superData); // Guarda los datos en el contexto
        alert("Inicio de sesión exitoso");
        navigate("/super-dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-super">
      <div className="login-super-container">
        <h1 className="login-title">Iniciar Sesión - Supermercado</h1>
        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
          />
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <button
          className="register-button"
          onClick={() => navigate("/register-super")}
        >
          ¿No tienes una cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}

export default LoginSuper;
