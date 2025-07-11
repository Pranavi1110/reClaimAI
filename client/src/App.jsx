import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import ReturnForm from "./components/ReturnForm";
import PartnerDashboard from "./components/PartnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Marketplace from "./components/Marketplace";
import Home from "./components/Home";
import RepairDashboard from "./components/RepairDashboard";
import NGODashboard from "./components/NGODashboard";

import Login from "./components/Login";
import "./App.css";
import CustomerDashboard from "./components/CustomerDashboard";
import PastCustomerReturns from "./components/PastCustomerReturns";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const linkStyle = {
    textDecoration: "none",
    color: "#2c3e50",
    fontWeight: "600",
  };

  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn");
    if (storedStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
           justifyContent: "flex-end",
          gap: "1rem",
          marginBottom: "1rem",
          padding: "1rem",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Link to="/" style={linkStyle}>Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/return" style={linkStyle}>Return</Link>
            <Link to="/past" style={linkStyle}>Past Return</Link>
            <Link to="/partner" style={linkStyle}>Partner</Link>
            <Link to="/admin" style={linkStyle}>Admin</Link>
            <Link to="/marketplace" style={linkStyle}>Marketplace</Link>
            <Link to="/repair" style={linkStyle}>Repair</Link>
            <Link to="/ngo" style={linkStyle}>NGO</Link>
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
          </>
        ) : (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/return" element={<ReturnForm />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/past" element={<PastCustomerReturns />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/repair" element={<RepairDashboard />} />
        <Route path="/ngo" element={<NGODashboard />} />
      </Routes>
    </Router>
  );
}


export default App;
