// src/contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user_token", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (storedToken) {
      // Aquí puedes verificar el token y cargar datos del usuario
      const userData = JSON.parse(localStorage.getItem("user_data")); // Opcional si guardas info extra
      setUser(userData);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
