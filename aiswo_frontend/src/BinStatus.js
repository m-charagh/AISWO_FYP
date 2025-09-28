import React from "react";

function BinStatus({ current }) {
  if (!current) return null;

  const { fillPct = 0, weightKg, status, updatedAt } = current;

  const getStatusInfo = (fillPct) => {
    if (fillPct > 80) return { 
      status: "Full", 
      class: "status-danger", 
      icon: "⚠️", 
      message: "Bin is almost full and needs immediate attention",
      gradient: "var(--gradient-danger)"
    };
    if (fillPct > 60) return { 
      status: "Warning", 
      class: "status-warning", 
      icon: "⚡", 
      message: "Bin is getting full, consider emptying soon",
      gradient: "var(--gradient-warning)"
    };
    return { 
      status: "Normal", 
      class: "status-normal", 
      icon: "✅", 
      message: "Bin is operating normally",
      gradient: "var(--gradient-primary)"
    };
  };

  const statusInfo = getStatusInfo(fillPct);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <h3 style={{ 
          margin: "0", 
          fontSize: "var(--font-size-xl)", 
          fontWeight: "600",
          color: "var(--text-primary)"
        }}>
          Current Status
        </h3>
        <span className={`status-indicator ${statusInfo.class}`}>
          {statusInfo.icon} {statusInfo.status}
        </span>
      </div>

      {/* Metrics Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
        gap: "var(--space-lg)",
        marginBottom: "var(--space-lg)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "var(--font-size-2xl)", 
            fontWeight: "700", 
            color: "var(--primary-green)",
            marginBottom: "var(--space-xs)"
          }}>
            {weightKg || 0}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Weight (kg)</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "var(--font-size-2xl)", 
            fontWeight: "700", 
            color: fillPct > 80 ? "var(--warning-red)" : fillPct > 60 ? "var(--warning-orange)" : "var(--primary-green)",
            marginBottom: "var(--space-xs)"
          }}>
            {fillPct}%
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Fill Level</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "var(--font-size-2xl)", 
            fontWeight: "700", 
            color: "var(--text-primary)",
            marginBottom: "var(--space-xs)"
          }}>
            {status || "N/A"}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Status</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "var(--space-sm)" 
        }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Fill Level</span>
          <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{fillPct}%</span>
        </div>
        <div className="progress-container" style={{ height: "16px" }}>
          <div 
            className="progress-bar"
            style={{
              width: `${fillPct}%`,
              background: statusInfo.gradient
            }}
          />
        </div>
      </div>

      {/* Status Message */}
      <div style={{
        padding: "var(--space-md)",
        background: statusInfo.gradient,
        color: "var(--white)",
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-lg)",
        textAlign: "center",
        fontWeight: "500"
      }}>
        {statusInfo.message}
      </div>

      {/* Last Updated */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "var(--space-sm)",
        background: "var(--light-gray)",
        borderRadius: "var(--radius-sm)"
      }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Last Updated</span>
        <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "var(--font-size-sm)" }}>
          {formatDate(updatedAt)}
        </span>
      </div>
    </div>
  );
}

export default BinStatus;
