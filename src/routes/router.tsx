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
import { AdminDashboard } from "../screens/admin/Dashboard";
import { AdminRoute } from "../components/adminRoute";
import { NotFound } from "../screens/NotFound";
import { AdminOverview } from "../screens/admin/Overview";
import { AdminUsers } from "../screens/admin/Users";
import { AdminAppointments } from "../screens/admin/Appointments";
import { AdminOrders } from "../screens/admin/Orders";
import { AdminProducts } from "../screens/admin/Products";
import { AdminSettings } from "../screens/admin/Settings";

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
      <Route path="*" element={<NotFound />} />
    </Route>
    
    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    >
      <Route index element={<AdminOverview />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="appointments" element={<AdminAppointments />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Routes>
);