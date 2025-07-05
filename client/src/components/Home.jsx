import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const features = [
    {
      icon: "📦",
      title: "Smart Returns",
      description:
        "AI-powered product condition assessment and intelligent routing",
    },
    {
      icon: "🤝",
      title: "Partner Network",
      description: "Connect with repair shops, recyclers, and donation centers",
    },
    {
      icon: "🌱",
      title: "Green Points",
      description: "Earn points for sustainable actions and track your impact",
    },
    {
      icon: "🛒",
      title: "Circular Marketplace",
      description: "Find refurbished and donated items at great prices",
    },
    {
      icon: "📊",
      title: "Impact Analytics",
      description: "Track CO₂ saved and waste diverted from landfills",
    },
    {
      icon: "🏆",
      title: "Gamification",
      description: "Compete on leaderboards and earn certificates",
    },
  ];

  const stats = [
    { number: "1,250+", label: "Returns Processed" },
    { number: "45.2", label: "Tons CO₂ Saved" },
    { number: "12.8", label: "Tons Waste Diverted" },
    { number: "45", label: "Active Partners" },
  ];

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Reverse Logistics Platform</h1>
          <p>
            Transform product returns into environmental impact. Our AI-powered
            platform intelligently routes returned items to repair, recycle, or
            donate, creating a sustainable circular economy.
          </p>
          <div className="hero-actions">
            <Link to="/return" className="cta-btn primary">
              Start a Return
            </Link>
            <Link to="/marketplace" className="cta-btn secondary">
              Browse Marketplace
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-visual">
            <div className="circular-flow">
              <div className="flow-item">📦</div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">🤖</div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">♻️</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>Platform Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload & Describe</h3>
            <p>Take a photo and describe your return reason</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI assesses condition and suggests optimal route</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Smart Routing</h3>
            <p>Item is sent to repair, recycle, or donation partner</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Earn Points</h3>
            <p>Get Green Points for your sustainable contribution</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join thousands of users already contributing to a sustainable future
          </p>
          <div className="cta-buttons">
            <Link to="/return" className="cta-btn primary large">
              Start Your Return Journey
            </Link>
            <Link to="/marketplace" className="cta-btn secondary large">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
