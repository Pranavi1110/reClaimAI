import { useState, useEffect } from "react";
import axios from "axios";
import "./PartnerDashboard.css";

const statusOptions = ["Received", "In Progress", "Repaired"];

const RepairDashboard = () => {
  const [repairItems, setRepairItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uiState, setUiState] = useState({}); // { [itemId]: { selectedStatus, justAdded } }

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/partner/repairs"
        );
        setRepairItems(res.data);
        setError(null);
        // Initialize uiState for each item
        const initialUi = {};
        res.data.forEach((item) => {
          initialUi[item._id] = {
            selectedStatus: item.repairStatus,
            justAdded: false,
          };
        });
        setUiState(initialUi);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle status change in dropdown and update DB
  const handleStatusChange = async (itemId, newStatus) => {
    setUiState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selectedStatus: newStatus,
      },
    }));
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/partner/repairs/${itemId}/status`,
        { repairStatus: newStatus }
      );
      // Update repairItems with new status
      setRepairItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, repairStatus: newStatus } : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // Add to marketplace (set readyForMarket=true and repairStatus=Repaired)
  const sendToMarketplace = async (item) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/partner/repairs/${item._id}/mark-repaired`
      );
      setRepairItems((prev) => prev.filter((i) => i._id !== item._id));
      setUiState((prev) => {
        const newState = { ...prev };
        delete newState[item._id];
        return newState;
      });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading repair items...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="partner-dashboard" style={{ padding: 24 }}>
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <h1>Repair Dashboard</h1>
        <div className="partner-info">
          <span className="partner-name">Repair Partner</span>
          <span className="partner-type">Repair Specialist</span>
        </div>
      </div>

      <div className="assigned-items">
        <h2 style={{ marginBottom: 16 }}>Items to Repair</h2>
        <div className="items-grid" style={{ gap: 24 }}>
          {repairItems.length === 0 ? (
            <div>No items to repair.</div>
          ) : (
            repairItems.map((item) => {
              const state = uiState[item._id] || {};
              return (
                <div
                  key={item._id}
                  className="item-card"
                  style={{
                    boxShadow: "0 2px 8px #eee",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div className="item-image" style={{ marginBottom: 12 }}>
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor:
                          (state.selectedStatus || item.repairStatus) ===
                          "Repaired"
                            ? "#27ae60"
                            : (state.selectedStatus || item.repairStatus) ===
                              "In Progress"
                            ? "#3498db"
                            : "#f39c12",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: 6,
                        padding: "4px 12px",
                        marginTop: 8,
                        display: "inline-block",
                      }}
                    >
                      {state.selectedStatus || item.repairStatus}
                    </div>
                  </div>
                  <div className="item-details" style={{ marginTop: 8 }}>
                    <h3 style={{ margin: 0 }}>{item.productName}</h3>
                    <p
                      className="description"
                      style={{ margin: "8px 0 4px 0", color: "#555" }}
                    >
                      {item.description || item.reason}
                    </p>
                    <p
                      className="assigned-date"
                      style={{ margin: 0, color: "#888" }}
                    >
                      Assigned:{" "}
                      {item.assignedDate || item.createdAt?.slice(0, 10)}
                    </p>
                    <div className="status-actions" style={{ marginTop: 12 }}>
                      <select
                        value={state.selectedStatus || item.repairStatus}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        className="status-select"
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          fontWeight: 500,
                        }}
                        disabled={item.repairStatus === "Repaired"}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* If user selects 'Repaired', show Send to Marketplace button */}
                    {state.selectedStatus === "Repaired" && (
                      <div className="proof-section" style={{ marginTop: 16 }}>
                        <button
                          onClick={() => sendToMarketplace(item)}
                          style={{
                            background: "#27ae60",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 18px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        >
                          Send to Marketplace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairDashboard;
