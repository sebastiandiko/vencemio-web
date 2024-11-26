// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [superuser, setSuperuser] = useState(null);

  const loginSuper = (superData, token) => {
    setSuperuser(superData);
    localStorage.setItem("super_token", token);
  };

  const logoutSuper = () => {
    setSuperuser(null);
    localStorage.removeItem("super_token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("super_token");
    if (storedToken) {
      // Aquí podrías hacer una llamada para verificar el token y obtener los datos del supermercado
    }
  }, []);

  return (
    <AuthContext.Provider value={{ superuser, loginSuper, logoutSuper }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
