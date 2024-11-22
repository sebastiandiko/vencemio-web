import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto

function LoginSuper() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setSuperuser } = useContext(AuthContext); // Accede al contexto

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login-super", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, super: superData } = response.data;
        localStorage.setItem("super_token", token);
        setSuperuser(superData); // Guarda los datos en el contexto
        navigate("/super-dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default LoginSuper;
