import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCliente from "./pages/login/LoginCliente";
import LoginSuper from "./pages/login/LoginSuper";
import HomePage from "./pages/HomePage";
import RegisterUser from "./pages/register/RegisterUser";
import RegisterSuper from "./pages/register/RegisterSuper";
import SuperDashboard from "./pages/supermarketPages/SuperDashboard";
import ProductForm from "./pages/supermarketPages/ProductForm";
import ProductEditForm from "./pages/supermarketPages/ProductEditForm";
import Header from "./layouts/Header";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/register-super" element={<RegisterSuper />} />
        <Route path="/login-super" element={<LoginSuper />} />
        <Route path="/super-dashboard" element={<SuperDashboard />} />
        <Route path="/product-form" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductEditForm />} />
      </Routes>
    </Router>
  );
}

export default App;
