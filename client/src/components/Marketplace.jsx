import { useState, useEffect } from "react";
import axios from "axios";
import "./Marketplace.css";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/marketplace");
        // Map backend fields to frontend fields
        const mapped = res.data.map((item) => ({
          id: item._id,
          name: item.productName || item.name || "Unnamed Product",
          description: item.description || item.reason || "No description",
          price: item.price || 0,
          originalPrice: item.originalPrice || 0,
          image: item.imageUrl,
          category: item.category || "Other",
          condition:
            item.condition ||
            (item.repairStatus === "Repaired" ? "repaired" : "refurbished"),
          available: true,
          greenPoints: item.greenPoints || 0,
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
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    if (selectedItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, available: false } : item
        )
      );
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
              <p>{item.description}</p>
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
          <div className="modal">
            <h2>Confirm Claim</h2>
            <p>Are you sure you want to claim this item?</p>
            <button onClick={confirmClaim}>Yes, Claim</button>
            <button onClick={() => setShowClaimModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
