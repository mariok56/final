// src/routes/router.tsx
import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/navbar";
import { Home } from "../screens/Home";
import { About } from "../screens/About";
import { Services } from "../screens/Services";
import { Contact } from "../screens/Contact";
import { Shop } from "../screens/Shop"; 
import { Login } from "../screens/Auth/Login";
import { Register } from "../screens/Auth/Register";
import { EnhancedBooking } from "../screens/booking";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="contact" element={<Contact />} />
      <Route path="shop" element={<Shop />} />
      <Route
        path="booking"
        element={
          <ProtectedRoute>
            <EnhancedBooking />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  </Routes>
);