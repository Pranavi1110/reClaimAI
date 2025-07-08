import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReturnForm from "./components/ReturnForm";
import PartnerDashboard from "./components/PartnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Marketplace from "./components/Marketplace";
import Home from "./components/Home";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for login status
  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn");
    if (storedStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.href = "/"; // ✅ Navigate to home
  };

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          padding: "1rem",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#2c3e50", fontWeight: "600" }}>
          Home
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#e74c3c",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none", color: "#2c3e50", fontWeight: "600" }}>
            Login
          </Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/return" element={<ReturnForm />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </Router>
  );
}

export default App;
