import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// 🔹 Reusable component
import BinStatus from "./BinStatus";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function BinDashboard() {
  const [current, setCurrent] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/bins/${id}`)
        .then(res => res.json())
        .then(data => setCurrent(data))
        .catch(err => console.error(err)),
      fetch(`http://localhost:5000/bins/${id}/history`)
        .then(res => res.json())
        .then(data => setHistory(data ? Object.values(data) : []))
        .catch(err => console.error(err))
    ]).finally(() => setLoading(false));
  }, [id]);

  const chartData = {
    labels: history.slice(-20).map(h => h.ts),
    datasets: [
      {
        label: "Weight (kg)",
        data: history.slice(-20).map(h => h.weightKg),
        borderColor: "#34C759",
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#34C759",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Fill Level (%)",
        data: history.slice(-20).map(h => h.fillPct),
        borderColor: "#52D765",
        backgroundColor: "rgba(82, 215, 101, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#52D765",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: 'Historical Data Trends',
        font: {
          size: 18,
          weight: '600'
        },
        color: '#1D1D1F',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#34C759',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(142, 142, 147, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6E6E73',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(142, 142, 147, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6E6E73',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-2xl)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading" style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-2xl)" }}>
        <Link 
          to="/" 
          className="btn btn-secondary"
          style={{ 
            marginBottom: "var(--space-lg)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-sm)"
          }}
        >
          ← Back to All Bins
        </Link>
        <h1 style={{ 
          fontSize: "var(--font-size-4xl)", 
          fontWeight: "700", 
          margin: "0 0 var(--space-md) 0",
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Bin Dashboard
        </h1>
        <p style={{ 
          fontSize: "var(--font-size-lg)", 
          color: "var(--text-secondary)",
          margin: "0"
        }}>
          Detailed monitoring and analytics for {id.toUpperCase()}
        </p>
      </div>

      {/* Current Status */}
      <BinStatus current={current} />

      {/* Chart Section */}
      <div className="card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
        <h3 style={{ 
          margin: "0 0 var(--space-lg) 0", 
          fontSize: "var(--font-size-xl)", 
          fontWeight: "600",
          color: "var(--text-primary)"
        }}>
          Historical Trends
        </h3>
        <div style={{ height: "400px", position: "relative" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent History Table */}
      <div className="card" style={{ padding: "var(--space-lg)" }}>
        <h3 style={{ 
          margin: "0 0 var(--space-lg) 0", 
          fontSize: "var(--font-size-xl)", 
          fontWeight: "600",
          color: "var(--text-primary)"
        }}>
          Recent History
        </h3>
        {history.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "var(--font-size-sm)"
            }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--light-gray)" }}>
                  <th style={{ 
                    padding: "var(--space-md)", 
                    textAlign: "left", 
                    color: "var(--text-secondary)",
                    fontWeight: "600"
                  }}>
                    Timestamp
                  </th>
                  <th style={{ 
                    padding: "var(--space-md)", 
                    textAlign: "center", 
                    color: "var(--text-secondary)",
                    fontWeight: "600"
                  }}>
                    Weight (kg)
                  </th>
                  <th style={{ 
                    padding: "var(--space-md)", 
                    textAlign: "center", 
                    color: "var(--text-secondary)",
                    fontWeight: "600"
                  }}>
                    Fill Level (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-10).reverse().map((h, i) => (
                  <tr key={i} style={{ 
                    borderBottom: "1px solid var(--light-gray)",
                    transition: "background-color var(--transition-fast)"
                  }}>
                    <td style={{ 
                      padding: "var(--space-md)", 
                      color: "var(--text-primary)",
                      fontWeight: "500"
                    }}>
                      {h.ts}
                    </td>
                    <td style={{ 
                      padding: "var(--space-md)", 
                      textAlign: "center",
                      color: "var(--primary-green)",
                      fontWeight: "600"
                    }}>
                      {h.weightKg}
                    </td>
                    <td style={{ 
                      padding: "var(--space-md)", 
                      textAlign: "center",
                      color: h.fillPct > 80 ? "var(--warning-red)" : h.fillPct > 60 ? "var(--warning-orange)" : "var(--primary-green)",
                      fontWeight: "600"
                    }}>
                      {h.fillPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "var(--space-2xl)",
            color: "var(--text-secondary)"
          }}>
            <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--space-lg)" }}>📊</div>
            <p>No historical data available for this bin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BinDashboard;
