import React, { useState } from "react";
import axios from "axios";

function LoginSuper() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Validar que los campos no estén vacíos
      if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // Enviar solicitud al backend
      const response = await axios.post("http://localhost:5000/api/auth/login-super", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, super: superData } = response.data;
        alert(`Bienvenido ${superData.cadena}!`);

        // Guardar el token en localStorage (opcional)
        localStorage.setItem("super_token", token);

        // Redirigir o realizar otras acciones
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        alert(error.response.data.message || "Error al iniciar sesión.");
      }
    }
  };

  return (
    <div className="login-super-container">
      <h1 className="login-super-title">Iniciar Sesión - Supermercado</h1>
      <form className="login-super-form" onSubmit={handleLogin}>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          required
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
        <button type="submit" className="login-super-button">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default LoginSuper;
