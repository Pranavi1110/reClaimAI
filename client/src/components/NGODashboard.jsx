import React, { useEffect, useState } from "react";
import "./NGODashboard.css";

const NGODashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successStories, setSuccessStories] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState({
    childrenHelped: 0,
    foodRedirected: 0,
    clothingDonated: 0,
  });
  const [donationHistory, setDonationHistory] = useState([]);
  const [topDonor, setTopDonor] = useState(null);
  const [greenPoints, setGreenPoints] = useState(0);
  const [rank, setRank] = useState(null);
  const [totalNgos, setTotalNgos] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [uploadingProof, setUploadingProof] = useState({});
  const [proofStatus, setProofStatus] = useState({});

  useEffect(() => {
    fetch("/api/ngo/returns")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      });

    fetch("/api/ngo/metrics")
      .then((res) => res.json())
      .then((data) => {
        setImpactMetrics(data.metrics || {});
        setTopDonor(data.topDonor || null);
        setDonationHistory(data.history || []);
      });

    fetch("/api/ngo/success-stories")
      .then((res) => res.json())
      .then((data) => setSuccessStories(data.stories || []));

    fetch("/api/ngo/credits-and-rank")
      .then((res) => res.json())
      .then((data) => {
        setGreenPoints(data.greenPoints);
        setRank(data.rank);
        setTotalNgos(data.totalNgos);
        setLeaderboard(data.leaderboard);
      });

    fetch("/api/ngo/donation-history")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch donation history");
        return res.json();
      })
      .then((data) => setDonationHistory(data.history || []))
      .catch((err) => {
        setDonationHistory([]);
        console.error("Donation history error:", err);
      });
  }, []);

  const handleStatusChange = (itemId, newStatus) => {
    fetch(`/api/ngo/returns/${itemId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch("/api/ngo/returns")
          .then((res) => res.json())
          .then((data) => setItems(data.items || []));

        if (newStatus === "donated") {
          fetch("/api/ngo/credits-and-rank")
            .then((res) => res.json())
            .then((data) => {
              setGreenPoints(data.greenPoints);
              setRank(data.rank);
              setTotalNgos(data.totalNgos);
              setLeaderboard(data.leaderboard);
            });
        }
      });
  };

  const handleUploadProof = (itemId, file) => {
    setUploadingProof((prev) => ({ ...prev, [itemId]: true }));
    const formData = new FormData();
    formData.append("proof", file);
    fetch(`/api/ngo/returns/${itemId}/upload-proof`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((updated) => {
        setItems(
          items.map((item) => (item._id === itemId ? updated.item : item))
        );
        setProofStatus((prev) => ({
          ...prev,
          [itemId]:
            updated.item.proofVerified === true
              ? "✅ Verified"
              : updated.item.proofVerified === false
              ? `❌ Rejected: ${updated.item.proofReason}`
              : "Pending...",
        }));
        // Refresh donation history after proof upload
        fetch("/api/ngo/donation-history")
          .then((res) => res.json())
          .then((data) => setDonationHistory(data.history || []));
      })
      .finally(() =>
        setUploadingProof((prev) => ({ ...prev, [itemId]: false }))
      );
  };

  const handleAddStory = (caption) => {
    fetch("/api/ngo/success-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    })
      .then((res) => res.json())
      .then((data) => setSuccessStories([...successStories, data.story]));
  };

  const handleExportHistory = () => {
    fetch("/api/ngo/export-history")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "donation_history.csv";
        a.click();
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="ngo-dashboard">
      <h1>NGO Dashboard</h1>
      <div className="green-credit-counter">
        <span>
          🌱 Green Credits: <b>{greenPoints}</b>
        </span>
      </div>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <section className="impact-metrics">
            <h2>Impact Metrics</h2>
            <ul>
              <li>Number of children helped: {impactMetrics.childrenHelped}</li>
              <li>kg of food redirected: {impactMetrics.foodRedirected}</li>
              <li>Clothing sets donated: {impactMetrics.clothingDonated}</li>
            </ul>
          </section>
          <section className="top-donor">
            <h2>🏆 Top NGO Donor of the Month</h2>
            {topDonor ? (
              <div>
                {topDonor.name} ({topDonor.credits} green credits)
              </div>
            ) : (
              <div>No data yet.</div>
            )}
          </section>
        </aside>
        <main className="main-content">
          <section className="items-list">
            <h2>Items Available for Donation</h2>
            {items.length === 0 ? (
              <div>No items available.</div>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item._id} className="item-card">
                    <div className="item-image-wrapper">
                      <img
                        src={item.imageUrl || "/default-item.png"}
                        alt={item.productName}
                        className="item-image"
                      />
                    </div>
                    <div className="item-details">
                      <div>
                        <b>{item.productName}</b>
                      </div>
                      <div>Condition: {item.condition}</div>
                      <div>Status: {item.status}</div>
                    </div>
                    <div className="item-actions">
                      <div className="upload-section">
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            className="upload-input"
                            onChange={(e) =>
                              handleUploadProof(item._id, e.target.files[0])
                            }
                            disabled={
                              item.status === "donated" ||
                              uploadingProof[item._id]
                            }
                          />
                          <span
                            className={
                              "upload-btn" +
                              (item.status === "donated" ? " disabled-btn" : "")
                            }
                          >
                            📸 Upload proof-of-donation image
                          </span>
                          {uploadingProof[item._id] && (
                            <span className="proof-status uploading">
                              Validating...
                            </span>
                          )}
                          {proofStatus[item._id] && (
                            <span className="proof-status">
                              {proofStatus[item._id]}
                            </span>
                          )}
                        </label>
                      </div>
                      <button
                        onClick={() => handleStatusChange(item._id, "received")}
                        disabled={
                          item.status === "donated" ||
                          item.status === "received"
                        }
                        className={
                          item.status === "donated" ||
                          item.status === "received"
                            ? "disabled-btn"
                            : ""
                        }
                      >
                        Mark as Received
                      </button>
                      <button
                        onClick={() => handleStatusChange(item._id, "donated")}
                        disabled={item.status === "donated"}
                        className={
                          item.status === "donated" ? "disabled-btn" : ""
                        }
                      >
                        {item.status === "donated"
                          ? "✅ Donated"
                          : "Mark as Donated"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="success-stories">
            <h2>💬 Success Stories</h2>
            <ul>
              {successStories.map((story, idx) => (
                <li key={idx}>{story.caption}</li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add a short success story or caption"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  handleAddStory(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </section>
          <section className="donation-history">
            <h2>📅 Donation History</h2>
            <button onClick={handleExportHistory}>Export as CSV</button>
            <ul>
              {donationHistory.length === 0 ? (
                <li>No donations yet.</li>
              ) : (
                donationHistory.map((entry, idx) => (
                  <li key={idx} className="donation-history-card">
                    <div className="donation-history-main">
                      <b>{entry.itemName}</b>{" "}
                      <span className={"donation-status " + entry.status}>
                        {entry.status}
                      </span>
                    </div>
                    <div>Date: {new Date(entry.date).toLocaleDateString()}</div>
                    <div>NGO: {entry.ngoName}</div>
                    <div>
                      Credits: <b>{entry.credits}</b>
                    </div>
                    {entry.proofImage && (
                      <div className="donation-proof-img">
                        <img
                          src={`http://localhost:5000/uploads/${entry.proofImage}`}
                          alt="Proof"
                        />
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </section>
          <section className="your-rank">
            <h2>🏆 Your Rank</h2>
            <div>
              Rank <b>#{rank}</b> of {totalNgos} NGOs
            </div>
            <ol className="leaderboard">
              {leaderboard.slice(0, 5).map((ngo, idx) => (
                <li
                  key={ngo.name}
                  className={
                    idx === 0
                      ? "gold"
                      : idx === 1
                      ? "silver"
                      : idx === 2
                      ? "bronze"
                      : ""
                  }
                >
                  {ngo.name} — <b>{ngo.greenPoints}</b> credits{" "}
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : ""}
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NGODashboard;
