import { useState } from "react";
import "./Marketplace.css";

const Marketplace = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Refurbished Laptop",
      description:
        "Dell Inspiron 15, fully refurbished with new battery and SSD",
      price: 299,
      originalPrice: 599,
      image: "https://via.placeholder.com/300x200",
      category: "Electronics",
      condition: "refurbished",
      available: true,
      greenPoints: 150,
    },
    {
      id: 2,
      name: "Donated Books Collection",
      description: "Set of 20 educational books for children aged 8-12",
      price: 25,
      originalPrice: 80,
      image: "https://via.placeholder.com/300x200",
      category: "Books",
      condition: "good",
      available: true,
      greenPoints: 50,
    },
    {
      id: 3,
      name: "Repaired Smartphone",
      description: "iPhone 11 with new screen and battery, fully functional",
      price: 199,
      originalPrice: 699,
      image: "https://via.placeholder.com/300x200",
      category: "Electronics",
      condition: "repaired",
      available: true,
      greenPoints: 200,
    },
    {
      id: 4,
      name: "Upcycled Furniture",
      description: "Wooden desk made from recycled materials",
      price: 89,
      originalPrice: 200,
      image: "https://via.placeholder.com/300x200",
      category: "Furniture",
      condition: "upcycled",
      available: false,
      greenPoints: 100,
    },
    {
      id: 5,
      name: "Eco-Friendly Toys",
      description: "Set of wooden toys made from sustainable materials",
      price: 35,
      originalPrice: 60,
      image: "https://via.placeholder.com/300x200",
      category: "Toys",
      condition: "good",
      available: true,
      greenPoints: 75,
    },
    {
      id: 6,
      name: "Refurbished Tablet",
      description: "iPad Air 2 with new display and updated software",
      price: 149,
      originalPrice: 399,
      image: "https://via.placeholder.com/300x200",
      category: "Electronics",
      condition: "refurbished",
      available: true,
      greenPoints: 125,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    "all",
    "Electronics",
    "Books",
    "Furniture",
    "Toys",
    "Clothing",
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

            <div className="item-content">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-category">{item.category}</div>

              <div className="price-section">
                <div className="price-info">
                  <span className="current-price">${item.price}</span>
                  <span className="original-price">${item.originalPrice}</span>
                  <span className="discount">
                    {Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
              </div>

              <div className="green-points">
                <span className="points-icon">🌱</span>
                <span>{item.greenPoints} Green Points</span>
              </div>

              <div className="item-actions">
                {item.available ? (
                  <button
                    className="claim-btn"
                    onClick={() => handleClaim(item)}
                  >
                    Claim Item
                  </button>
                ) : (
                  <button className="claimed-btn" disabled>
                    Already Claimed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showClaimModal && selectedItem && (
        <div className="modal-overlay">
          <div className="claim-modal">
            <h2>Claim Item</h2>
            <div className="modal-content">
              <img src={selectedItem.image} alt={selectedItem.name} />
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
              <div className="modal-price">
                <span className="price">${selectedItem.price}</span>
                <span className="green-points">
                  +{selectedItem.greenPoints} Green Points
                </span>
              </div>
              <p className="modal-note">
                By claiming this item, you agree to pick it up within 7 days
                from our partner location.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowClaimModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmClaim}>
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
