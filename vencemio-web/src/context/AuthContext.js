import React, { createContext, useState } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [superuser, setSuperuser] = useState(null);

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("super_token");
    setSuperuser(null);
  };

  return (
    <AuthContext.Provider value={{ superuser, setSuperuser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
