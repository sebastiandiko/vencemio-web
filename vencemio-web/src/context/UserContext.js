import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData)); // Guardamos también los datos del usuario
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    const storedUserData = JSON.parse(localStorage.getItem("user_data"));
    if (storedToken && storedUserData) {
      setUser(storedUserData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
