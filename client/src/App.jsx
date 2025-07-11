import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReturnForm from "./components/ReturnForm";
import PartnerDashboard from "./components/PartnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Marketplace from "./components/Marketplace";
import Home from "./components/Home";
import RepairDashboard from "./components/RepairDashboard";
import NGODashboard from "./components/NGODashboard";
import "./App.css";

function App() {
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
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Home
        </Link>
        <Link
          to="/return"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Return
        </Link>
        <Link
          to="/partner"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Partner
        </Link>
        <Link
          to="/admin"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Admin
        </Link>
        <Link
          to="/marketplace"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Marketplace
        </Link>
        <Link
          to="/repair"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          Repair
        </Link>
        <Link
          to="/ngo"
          style={{
            textDecoration: "none",
            color: "#2c3e50",
            fontWeight: "600",
          }}
        >
          NGO
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/return" element={<ReturnForm />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/repair" element={<RepairDashboard />} />
        <Route path="/ngo" element={<NGODashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
