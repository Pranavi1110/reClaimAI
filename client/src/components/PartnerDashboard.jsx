import { useState } from "react";
import "./PartnerDashboard.css";

const PartnerDashboard = () => {
  const [assignedItems, setAssignedItems] = useState([
    {
      id: 1,
      productName: "Laptop",
      condition: "damaged",
      status: "pending",
      assignedDate: "2024-01-15",
      description: "Screen cracked, needs replacement",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      productName: "Smartphone",
      condition: "repairable",
      status: "in_progress",
      assignedDate: "2024-01-14",
      description: "Battery replacement needed",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      productName: "Tablet",
      condition: "good",
      status: "completed",
      assignedDate: "2024-01-13",
      description: "Minor scratches, ready for resale",
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [stats, setStats] = useState({
    totalAssigned: 15,
    pending: 5,
    inProgress: 7,
    completed: 3,
    greenPoints: 1250,
  });

  const updateStatus = (itemId, newStatus) => {
    setAssignedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "in_progress":
        return "#3498db";
      case "completed":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="partner-dashboard">
      <div className="dashboard-header">
        <h1>Partner Dashboard</h1>
        <div className="partner-info">
          <span className="partner-name">Tech Repair Hub</span>
          <span className="partner-type">Repair Shop</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Assigned</h3>
          <p className="stat-number">{stats.totalAssigned}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number pending">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number in-progress">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number completed">{stats.completed}</p>
        </div>
        <div className="stat-card green-points">
          <h3>Green Points</h3>
          <p className="stat-number">{stats.greenPoints}</p>
        </div>
      </div>

      <div className="assigned-items">
        <h2>Assigned Items</h2>
        <div className="items-grid">
          {assignedItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.productName} />
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {getStatusText(item.status)}
                </div>
              </div>
              <div className="item-details">
                <h3>{item.productName}</h3>
                <p className="condition">Condition: {item.condition}</p>
                <p className="description">{item.description}</p>
                <p className="assigned-date">Assigned: {item.assignedDate}</p>

                <div className="status-actions">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button className="update-btn">Update</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">📊</span>
            View Analytics
          </button>
          <button className="action-btn">
            <span className="action-icon">📋</span>
            Generate Report
          </button>
          <button className="action-btn">
            <span className="action-icon">🏆</span>
            View Leaderboard
          </button>
          <button className="action-btn">
            <span className="action-icon">📞</span>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
