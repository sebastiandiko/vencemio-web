import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router para navegación
import "./LoginCliente.css"; // Archivo CSS para estilos

function LoginCliente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      // Realizar una solicitud POST al endpoint de inicio de sesión
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en el almacenamiento local
        localStorage.setItem("token", data.token);

        // Redirigir al UserHome
        alert("Inicio de sesión exitoso");
        navigate("/user-home");
      } else {
        // Mostrar error en caso de credenciales incorrectas
        alert(data.message || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un problema con el inicio de sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Termina el estado de carga
    }
  };

  return (
    <div className="login-cliente">
      <div className="login-cliente-container">
        <h1 className="login-title">Iniciar Sesión - Cliente</h1>
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault(); // Evitar recarga de página
            handleLogin();
          }}
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
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          ¿No tienes una cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}

export default LoginCliente;
