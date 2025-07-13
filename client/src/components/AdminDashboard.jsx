import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalReturns: 1250,
    co2Saved: 45.2, // tons
    wasteDiverted: 12.8, // tons
    totalPartners: 45,
    activeReturns: 89,
    completedReturns: 1161,
  });

  const [pendingReturns, setPendingReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReturns();
  }, []);

  const fetchPendingReturns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/return/pending");
      setPendingReturns(res.data.returns || []);
    } catch (err) {
      console.error("Error fetching pending returns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCollected = async (returnId) => {
    try {
      await axios.post("http://localhost:5000/api/admin/mark-collected", {
        returnId,
      });
      // Remove from pending list
      setPendingReturns((prev) => prev.filter((ret) => ret._id !== returnId));
    } catch (err) {
      alert(
        "Error marking as collected: " + err.response?.data?.message ||
          err.message
      );
    }
  };

  const [categoryData] = useState([
    { category: "Electronics", count: 450, percentage: 36 },
    { category: "Clothing", count: 320, percentage: 25.6 },
    { category: "Furniture", count: 180, percentage: 14.4 },
    { category: "Books", count: 150, percentage: 12 },
    { category: "Toys", count: 100, percentage: 8 },
    { category: "Other", count: 50, percentage: 4 },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      action: "New return initiated",
      item: "Laptop",
      time: "2 minutes ago",
      user: "john.doe@email.com",
    },
    {
      id: 2,
      action: "Partner assigned",
      item: "Smartphone",
      time: "5 minutes ago",
      user: "Tech Repair Hub",
    },
    {
      id: 3,
      action: "Return completed",
      item: "Tablet",
      time: "10 minutes ago",
      user: "Green Recycle Co",
    },
    {
      id: 4,
      action: "New partner registered",
      item: "N/A",
      time: "15 minutes ago",
      user: "Eco Donations NGO",
    },
    {
      id: 5,
      action: "Marketplace item claimed",
      item: "Refurbished Laptop",
      time: "20 minutes ago",
      user: "sarah.smith@email.com",
    },
  ]);

  const [topPartners] = useState([
    { name: "Tech Repair Hub", returns: 89, greenPoints: 2450, efficiency: 94 },
    {
      name: "Green Recycle Co",
      returns: 67,
      greenPoints: 1890,
      efficiency: 91,
    },
    {
      name: "Eco Donations NGO",
      returns: 45,
      greenPoints: 1560,
      efficiency: 88,
    },
    { name: "Fix It Fast", returns: 34, greenPoints: 1230, efficiency: 85 },
    {
      name: "Sustainable Solutions",
      returns: 28,
      greenPoints: 980,
      efficiency: 82,
    },
  ]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button className="export-btn">Export Report</button>
          <button className="settings-btn">Settings</button>
        </div>
      </div>

      {/* Pending Returns Section */}
      <div className="pending-returns-section">
        <h2>Pending Returns ({pendingReturns.length})</h2>
        {loading ? (
          <div>Loading pending returns...</div>
        ) : pendingReturns.length === 0 ? (
          <div>No pending returns.</div>
        ) : (
          <div className="returns-grid">
            {pendingReturns.map((ret) => (
              <div key={ret._id} className="return-card">
                <div className="return-image">
                  <img src={ret.imageUrl} alt={ret.productName} />
                </div>
                <div className="return-details">
                  <h3>{ret.productName}</h3>
                  <p>
                    <strong>Reason:</strong> {ret.reason}
                  </p>
                  <p>
                    <strong>Condition:</strong> {ret.condition}
                  </p>
                  <p>
                    <strong>Status:</strong> {ret.status}
                  </p>
                  <p>
                    <strong>User:</strong> {ret.userEmail}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(ret.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleMarkCollected(ret._id)}
                    className="mark-collected-btn"
                  >
                    Mark as Collected
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>Total Returns</h3>
            <p className="metric-value">
              {analytics.totalReturns.toLocaleString()}
            </p>
            <span className="metric-change positive">+12% this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌱</div>
          <div className="metric-content">
            <h3>CO₂ Saved</h3>
            <p className="metric-value">{analytics.co2Saved} tons</p>
            <span className="metric-change positive">+8% this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">♻️</div>
          <div className="metric-content">
            <h3>Waste Diverted</h3>
            <p className="metric-value">{analytics.wasteDiverted} tons</p>
            <span className="metric-change positive">+15% this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🤝</div>
          <div className="metric-content">
            <h3>Active Partners</h3>
            <p className="metric-value">{analytics.totalPartners}</p>
            <span className="metric-change positive">+3 this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>Active Returns</h3>
            <p className="metric-value">{analytics.activeReturns}</p>
            <span className="metric-change neutral">No change</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Completed</h3>
            <p className="metric-value">{analytics.completedReturns}</p>
            <span className="metric-change positive">+18% this month</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Category Distribution</h2>
          <div className="category-chart">
            {categoryData.map((item, index) => (
              <div key={index} className="category-bar">
                <div className="bar-label">
                  <span>{item.category}</span>
                  <span>{item.count}</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="bar-percentage">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h2>Top Performing Partners</h2>
          <div className="partners-list">
            {topPartners.map((partner, index) => (
              <div key={index} className="partner-item">
                <div className="partner-rank">#{index + 1}</div>
                <div className="partner-info">
                  <h4>{partner.name}</h4>
                  <p>
                    {partner.returns} returns • {partner.greenPoints} points
                  </p>
                </div>
                <div className="partner-efficiency">
                  <span className="efficiency-score">
                    {partner.efficiency}%
                  </span>
                  <span className="efficiency-label">Efficiency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>{activity.action}</strong> - {activity.item}
                </p>
                <p className="activity-meta">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-box">
          <h3>Average Processing Time</h3>
          <p className="stat-value">3.2 days</p>
        </div>
        <div className="stat-box">
          <h3>Customer Satisfaction</h3>
          <p className="stat-value">4.8/5</p>
        </div>
        <div className="stat-box">
          <h3>Partner Satisfaction</h3>
          <p className="stat-value">4.6/5</p>
        </div>
        <div className="stat-box">
          <h3>Marketplace Revenue</h3>
          <p className="stat-value">$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
