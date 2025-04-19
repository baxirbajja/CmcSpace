import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Spaces from "./pages/Spaces";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import CMC from "./pages/CMC";
import Login from "./pages/Admin/Login";
import SpacesManagement from "./pages/Admin/SpacesManagement";
import ReservationsManagement from "./pages/Admin/ReservationsManagement";
import ReportsManagement from "./pages/Admin/ReportsManagement";
import HistoryManagement from "./pages/Admin/HistoryManagement/HistoryManagement";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Vérifier si un token existe dans le localStorage au chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Mettre à jour l'état d'authentification
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Spaces />} />
        <Route path="/reserver" element={<Reservation />} />
        <Route path="/reserver/:id" element={<Reservation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cmc" element={<CMC />} />
        <Route path="/admin/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin/spaces"
          element={
            <ProtectedRoute>
              <SpacesManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute>
              <ReservationsManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <ReportsManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <ProtectedRoute>
              <HistoryManagement onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
