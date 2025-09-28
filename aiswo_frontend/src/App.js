import React, { useEffect, useState } from "react";
import { requestFcmToken } from "./fcm";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Pages
import LandingPage from "./LandingPage";
import BinsList from "./BinsList";
import BinDashboard from "./BinDashboard";
import WeatherForecast from "./WeatherForecast";
import AdminDashboard from "./AdminDashboard";
import ChatBot from "./ChatBot";

// Navigation Component
function Navigation({ bins, showChatBot, setShowChatBot }) {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/bin/');
  const isLanding = location.pathname === '/';
  
  const totalBins = Object.keys(bins).length;
  const warningBins = Object.values(bins).filter(bin => bin.fillPct > 60 && bin.fillPct <= 80).length;
  const fullBins = Object.values(bins).filter(bin => bin.fillPct > 80).length;

  if (isLanding) return null;

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-icon">♻️</div>
          Smart Bins
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          {!isDashboard && (
            <div className="nav-stats">
              <div className="nav-stat">
                <span className="nav-stat-value">{totalBins}</span>
                <span className="nav-stat-label">Total</span>
              </div>
              <div className="nav-stat">
                <span className="nav-stat-value" style={{ color: 'var(--warning-orange)' }}>{warningBins}</span>
                <span className="nav-stat-label">Warning</span>
              </div>
              <div className="nav-stat">
                <span className="nav-stat-value" style={{ color: 'var(--warning-red)' }}>{fullBins}</span>
                <span className="nav-stat-label">Full</span>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Link to="/weather" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              🌤️ Weather
            </Link>
            <Link to="/admin" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              ⚙️ Admin
            </Link>
            <button
              onClick={() => setShowChatBot(!showChatBot)}
              className="btn btn-primary"
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              🤖 Chat
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", textAlign: "center" }}>
      <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--space-lg)" }}>🔍</div>
      <h1 style={{ 
        fontSize: "var(--font-size-3xl)", 
        fontWeight: "700", 
        marginBottom: "var(--space-md)",
        color: "var(--text-primary)"
      }}>
        Page Not Found
      </h1>
      <p style={{ 
        fontSize: "var(--font-size-lg)", 
        color: "var(--text-secondary)",
        marginBottom: "var(--space-lg)"
      }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        ← Back to Home
      </Link>
    </div>
  );
}

function App() {
  const [bins, setBins] = useState({});
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    requestFcmToken();
    
    // Fetch bins for navigation stats
    fetch("http://localhost:5000/bins")
      .then((res) => res.json())
      .then((data) => setBins(data))
      .catch((err) => console.error("Error fetching bins for nav:", err));
  }, []);

  return (
    <div className="App">
      <Router>
        <Navigation bins={bins} showChatBot={showChatBot} setShowChatBot={setShowChatBot} />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard: All bins list */}
          <Route path="/dashboard" element={<BinsList />} />

          {/* Single bin detail */}
          <Route path="/bin/:id" element={<BinDashboard />} />

          {/* Weather Forecast */}
          <Route path="/weather" element={<WeatherForecast />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* ChatBot */}
        <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
      </Router>
    </div>
  );
}

export default App;
