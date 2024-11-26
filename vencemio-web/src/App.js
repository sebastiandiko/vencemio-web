import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Agrega Navigate
import Header from "./layouts/Header"; // Importa el Header
import LoginCliente from "./pages/login/LoginCliente";
import LoginSuper from "./pages/login/LoginSuper";
import RegisterUser from "./pages/register/RegisterUser";
import RegisterSuper from "./pages/register/RegisterSuper";
import SuperDashboard from "./pages/supermarketPages/SuperDashboard";
import ProductForm from "./pages/supermarketPages/ProductForm";
import ProductEditForm from "./pages/supermarketPages/ProductEditForm";
import MapScreen from "./pages/userPages/MapScreen";
import UserHome from "./pages/userPages/UserHome";
import PrincipalPageComercio from "./pages/PrincipalPageComercio";
import PrincipalPageComprador from "./pages/PrincipalPageComprador";
import FavoritesPage from "./pages/userPages/FavoritesPage"; // Importa el componente de favoritos
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          {/* Redirección de la raíz al principal-comprador */}
          <Route path="/" element={<Navigate to="/principal-comprador" />} />
          
          {/* Otras rutas */}
          <Route path="/login" element={<LoginCliente />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-super" element={<RegisterSuper />} />
          <Route path="/login-super" element={<LoginSuper />} />
          <Route path="/super-dashboard" element={<SuperDashboard />} />
          <Route path="/product-form" element={<ProductForm />} />
          <Route path="/edit-product/:id" element={<ProductEditForm />} />
          <Route path="/map-screen" element={<MapScreen />} />
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/principal-comercio" element={<PrincipalPageComercio />} />
          <Route path="/principal-comprador" element={<PrincipalPageComprador />} />
          <Route path="/favorites" element={<FavoritesPage />} />      
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
