// 📌 React imports
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BinsList() {
  const [bins, setBins] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📌 Backend se bins fetch karo
  const fetchBins = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const res = await fetch("http://localhost:5000/bins");
      const data = await res.json();
      setBins(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bins:", err);
      setLoading(false);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBins();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => fetchBins(), 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (fillPct) => {
    if (fillPct > 80) return { status: "Full", class: "status-danger", icon: "⚠️" };
    if (fillPct > 60) return { status: "Warning", class: "status-warning", icon: "⚡" };
    return { status: "Normal", class: "status-normal", icon: "✅" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-2xl)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading" style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>
            Loading Smart Bins...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
          <h1 style={{ 
            fontSize: "var(--font-size-4xl)", 
            fontWeight: "700", 
            margin: "0",
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Smart Bin Monitoring
          </h1>
          <button
            onClick={() => fetchBins(true)}
            disabled={refreshing}
            className={`btn btn-secondary ${refreshing ? 'spinning' : ''}`}
            style={{
              padding: "var(--space-sm)",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--font-size-lg)"
            }}
            title="Refresh data"
          >
            ↻
          </button>
        </div>
        <p style={{ 
          fontSize: "var(--font-size-lg)", 
          color: "var(--text-secondary)",
          margin: "0 auto",
          maxWidth: "600px"
        }}>
          Real-time monitoring of waste collection bins with intelligent alerts and analytics
        </p>
        {refreshing && (
          <div style={{ 
            marginTop: "var(--space-md)",
            color: "var(--primary-green)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "500"
          }}>
            Updating data...
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="fade-in-up" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "var(--space-lg)",
        marginBottom: "var(--space-2xl)"
      }}>
        <div className="card" style={{ padding: "var(--space-lg)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--primary-green)", marginBottom: "var(--space-sm)" }}>
            {Object.keys(bins).length}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Total Bins</div>
        </div>
        <div className="card" style={{ padding: "var(--space-lg)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--warning-orange)", marginBottom: "var(--space-sm)" }}>
            {Object.values(bins).filter(bin => bin.fillPct > 60 && bin.fillPct <= 80).length}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Warning</div>
        </div>
        <div className="card" style={{ padding: "var(--space-lg)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--font-size-3xl)", fontWeight: "700", color: "var(--warning-red)", marginBottom: "var(--space-sm)" }}>
            {Object.values(bins).filter(bin => bin.fillPct > 80).length}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Full</div>
        </div>
      </div>

      {/* Bins Grid */}
      <div className="slide-in-right" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "var(--space-lg)"
      }}>
        {Object.entries(bins).map(([id, bin]) => {
          const statusInfo = getStatusInfo(bin.fillPct || 0);
  return (
            <div key={id} className="card" style={{ padding: "var(--space-lg)", position: "relative" }}>
              {/* Bin Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                <h3 style={{ 
                  margin: "0", 
                  fontSize: "var(--font-size-xl)", 
                  fontWeight: "600",
                  color: "var(--text-primary)"
                }}>
                  {id.toUpperCase()}
                </h3>
                <span className={`status-indicator ${statusInfo.class}`}>
                  {statusInfo.icon} {statusInfo.status}
                </span>
              </div>

              {/* Bin Metrics */}
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Weight</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {bin?.weightKg || 0} kg
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Fill Level</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {bin?.fillPct || 0}%
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Last Updated</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "var(--font-size-sm)" }}>
                    {formatDate(bin?.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${bin?.fillPct || 0}%`,
                      background: bin?.fillPct > 80 
                        ? "var(--gradient-danger)" 
                        : bin?.fillPct > 60 
                        ? "var(--gradient-warning)" 
                        : "var(--gradient-primary)"
                    }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <Link 
                to={`/bin/${id}`} 
                className="btn btn-primary"
            style={{
                  width: "100%", 
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-sm)"
                }}
              >
                View Details
                <span style={{ fontSize: "var(--font-size-sm)" }}>→</span>
            </Link>
          </div>
          );
        })}
      </div>

      {/* Empty State */}
      {Object.keys(bins).length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
          <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--space-lg)" }}>📊</div>
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "var(--space-sm)" }}>No bins available</h3>
          <p style={{ color: "var(--text-secondary)" }}>Check your connection or try again later.</p>
      </div>
      )}
    </div>
  );
}

export default BinsList;
