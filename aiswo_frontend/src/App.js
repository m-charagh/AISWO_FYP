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
import Footer from "./Footer";
import Login from "./Login";

// Navigation Component
function Navigation({ showChatBot, setShowChatBot, user, onLogout }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <nav className="nav-header" role="navigation" aria-label="Main navigation">
      <div className="nav-content">
        <Link to="/dashboard" className="nav-logo" aria-label="Smart Bins Home">
          <div className="nav-logo-icon" aria-hidden="true">♻️</div>
          Smart Bins
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Link to="/" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              🏠 Home
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              📊 Dashboard
            </Link>
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
              aria-label="Open AI Chat Assistant"
            >
              🤖 Chat
            </button>
            {user && (
              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ fontSize: 'var(--font-size-sm)' }}
                aria-label="Logout"
              >
                🚪 Logout
              </button>
            )}
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    requestFcmToken();
    
    // Fetch bins for navigation stats
    fetch("http://localhost:5000/bins")
      .then((res) => res.json())
      .then((data) => setBins(data))
      .catch((err) => console.error("Error fetching bins for nav:", err));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing login on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Navigation showChatBot={showChatBot} setShowChatBot={setShowChatBot} user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Dashboard: All bins list */}
            <Route path="/dashboard" element={<BinsList />} />

            {/* Single bin detail */}
            <Route path="/bin/:id" element={<BinDashboard />} />

            {/* Weather Forecast */}
            <Route path="/weather" element={<WeatherForecast />} />

            {/* Login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Admin Dashboard - Protected */}
            <Route 
              path="/admin" 
              element={
                user ? (
                  <AdminDashboard />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* ChatBot */}
        <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
      </Router>
    </div>
  );
}

export default App;
