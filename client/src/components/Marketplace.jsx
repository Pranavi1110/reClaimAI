import { useState, useEffect } from "react";
import axios from "axios";
import "./Marketplace.css";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userGreenPoints, setUserGreenPoints] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/marketplace");
        // Map backend fields to frontend fields
        const mapped = res.data.map((item) => ({
          id: item._id,
          name: item.productName || item.name || "Unnamed Product",
          description: item.description || item.reason || "No description",
          price: Math.floor(Math.random() * 50) + 10, // Random price between 10-60
          originalPrice: Math.floor(Math.random() * 100) + 50, // Random original price between 50-150
          image: item.imageUrl,
          category: item.category || "Other",
          condition:
            item.repairStatus === "Repaired"
              ? "Good Condition"
              : item.condition === "unknown"
              ? "Good Condition"
              : item.condition || "Good Condition",
          available: true,
          greenPoints: Math.floor(Math.random() * 20) + 5, // Random green points between 5-25
        }));
        setItems(mapped);
      } catch (err) {
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  const categories = [
    "all",
    "Electronics",
    "Books",
    "Furniture",
    "Toys",
    "Clothing",
    "Other",
  ];

  const filteredItems = items
    .filter(
      (item) => selectedCategory === "all" || item.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "greenPoints":
          return b.greenPoints - a.greenPoints;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleClaim = (item) => {
    console.log("Claim button clicked for item:", item);
    setSelectedItem(item);
    setShowClaimModal(true);
    console.log("Modal should be visible now, showClaimModal:", true);
  };

  // Debug modal state
  console.log(
    "Current modal state - showClaimModal:",
    showClaimModal,
    "selectedItem:",
    selectedItem
  );

  const confirmClaim = async () => {
    if (selectedItem) {
      const storedUser = localStorage.getItem("user");
      console.log("Stored user:", storedUser);
      const userId = storedUser ? JSON.parse(storedUser)._id : null;
      console.log("User ID:", userId);
      if (!userId) {
        alert("User not found. Please log in again.");
        setShowClaimModal(false);
        setSelectedItem(null);
        return;
      }
      try {
        console.log("Claiming item:", selectedItem.id);
        const res = await axios.post(
          `http://localhost:5000/api/marketplace/claim/${selectedItem.id}`,
          { userId }
        );
        console.log("Claim response:", res.data);

        // Remove item from the list immediately
        setItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
        setUserGreenPoints(res.data.greenPoints);

        // Show success alert with actual green points earned
        const pointsEarned = res.data.pointsEarned || selectedItem.greenPoints;
        alert(
          `Claimed successfully! You've earned ${pointsEarned} green points.`
        );
      } catch (err) {
        console.error("Claim error:", err);
        alert(err.response?.data?.error || err.message);
      }
      setShowClaimModal(false);
      setSelectedItem(null);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "refurbished":
        return "#3498db";
      case "repaired":
        return "#27ae60";
      case "Good Condition":
        return "#2ecc71";
      case "upcycled":
        return "#f39c12";
      case "good":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>Circular Marketplace</h1>
        <p>
          Discover refurbished, repaired, and donated items while earning Green
          Points
        </p>
      </div>

      <div className="marketplace-controls">
        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="greenPoints">Green Points</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`item-card ${!item.available ? "unavailable" : ""}`}
          >
            <div className="item-image">
              <img src={item.image} alt={item.name} />
              <div
                className="condition-badge"
                style={{ backgroundColor: getConditionColor(item.condition) }}
              >
                {item.condition}
              </div>
              {!item.available && (
                <div className="claimed-overlay">
                  <span>Claimed</span>
                </div>
              )}
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Green Points: {item.greenPoints}</p>
              {item.available && (
                <button onClick={() => handleClaim(item)} className="claim-btn">
                  Claim
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showClaimModal && (
        <div className="modal-overlay">
          <div className="claim-modal">
            <h2>Confirm Claim</h2>
            <p>Are you sure you want to claim this item?</p>
            <button onClick={confirmClaim}>Yes, Claim</button>
            <button onClick={() => setShowClaimModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {userGreenPoints !== null && (
        <div className="green-points-banner">
          You have been awarded {userGreenPoints} Green Points!
        </div>
      )}
    </div>
  );
};

export default Marketplace;
