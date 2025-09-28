import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [bins, setBins] = useState({});
  const [operators, setOperators] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bins');
  const [showBinForm, setShowBinForm] = useState(false);
  const [showOperatorForm, setShowOperatorForm] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [editingOperator, setEditingOperator] = useState(null);

  const [binForm, setBinForm] = useState({
    id: '',
    name: '',
    location: '',
    capacity: '',
    operatorId: '',
    status: 'Active'
  });

  const [operatorForm, setOperatorForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    assignedBins: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [binsResponse, operatorsResponse] = await Promise.all([
        axios.get('http://localhost:5000/bins'),
        axios.get('http://localhost:5000/operators')
      ]);
      setBins(binsResponse.data);
      setOperators(operatorsResponse.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBinSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBin) {
        await axios.put(`http://localhost:5000/bins/${editingBin}`, binForm);
      } else {
        await axios.post('http://localhost:5000/bins', binForm);
      }
      fetchData();
      setShowBinForm(false);
      setEditingBin(null);
      setBinForm({ id: '', name: '', location: '', capacity: '', operatorId: '', status: 'Active' });
    } catch (error) {
      console.error('Error saving bin:', error);
    }
  };

  const handleOperatorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOperator) {
        await axios.put(`http://localhost:5000/operators/${editingOperator}`, operatorForm);
      } else {
        await axios.post('http://localhost:5000/operators', operatorForm);
      }
      fetchData();
      setShowOperatorForm(false);
      setEditingOperator(null);
      setOperatorForm({ id: '', name: '', email: '', phone: '', assignedBins: [] });
    } catch (error) {
      console.error('Error saving operator:', error);
    }
  };

  const handleEditBin = (binId) => {
    const bin = bins[binId];
    setBinForm({
      id: binId,
      name: bin.name || binId,
      location: bin.location || '',
      capacity: bin.capacity || '',
      operatorId: bin.operatorId || '',
      status: bin.status || 'Active'
    });
    setEditingBin(binId);
    setShowBinForm(true);
  };

  const handleEditOperator = (operatorId) => {
    const operator = operators[operatorId];
    setOperatorForm({
      id: operatorId,
      name: operator.name || '',
      email: operator.email || '',
      phone: operator.phone || '',
      assignedBins: operator.assignedBins || []
    });
    setEditingOperator(operatorId);
    setShowOperatorForm(true);
  };

  const handleDeleteBin = async (binId) => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      try {
        await axios.delete(`http://localhost:5000/bins/${binId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting bin:', error);
      }
    }
  };

  const handleDeleteOperator = async (operatorId) => {
    if (window.confirm('Are you sure you want to delete this operator?')) {
      try {
        await axios.delete(`http://localhost:5000/operators/${operatorId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting operator:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--space-2xl)", textAlign: "center" }}>
        <div className="loading" style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ 
          fontSize: "var(--font-size-4xl)", 
          fontWeight: "700", 
          margin: "0 0 var(--space-md) 0",
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Admin Dashboard
        </h1>
        <p style={{ 
          fontSize: "var(--font-size-lg)", 
          color: "var(--text-secondary)",
          margin: "0"
        }}>
          Manage bins, operators, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "var(--space-sm)", 
        marginBottom: "var(--space-lg)",
        borderBottom: "2px solid var(--light-gray)"
      }}>
        <button
          onClick={() => setActiveTab('bins')}
          className={`btn ${activeTab === 'bins' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            border: "none",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
            marginBottom: "-2px"
          }}
        >
          Bins Management
        </button>
        <button
          onClick={() => setActiveTab('operators')}
          className={`btn ${activeTab === 'operators' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            border: "none",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
            marginBottom: "-2px"
          }}
        >
          Operators Management
        </button>
      </div>

      {/* Bins Tab */}
      {activeTab === 'bins' && (
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "var(--space-lg)" 
          }}>
            <h2 style={{ margin: "0", fontSize: "var(--font-size-xl)", color: "var(--text-primary)" }}>
              Smart Bins ({Object.keys(bins).length})
            </h2>
            <button
              onClick={() => {
                setEditingBin(null);
                setBinForm({ id: '', name: '', location: '', capacity: '', operatorId: '', status: 'Active' });
                setShowBinForm(true);
              }}
              className="btn btn-primary"
            >
              + Add New Bin
            </button>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "var(--space-lg)" 
          }}>
            {Object.entries(bins).map(([binId, bin]) => (
              <div key={binId} className="card" style={{ padding: "var(--space-lg)" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "var(--space-md)" 
                }}>
                  <h3 style={{ margin: "0", fontSize: "var(--font-size-lg)", color: "var(--text-primary)" }}>
                    {bin.name || binId.toUpperCase()}
                  </h3>
                  <span className={`status-indicator ${bin.fillPct > 80 ? 'status-danger' : bin.fillPct > 60 ? 'status-warning' : 'status-normal'}`}>
                    {bin.fillPct || 0}%
                  </span>
                </div>

                <div style={{ marginBottom: "var(--space-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Location:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>{bin.location || 'Not set'}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Capacity:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>{bin.capacity || 'N/A'}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Operator:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>
                      {bin.operatorId ? operators[bin.operatorId]?.name || bin.operatorId : 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <button
                    onClick={() => handleEditBin(binId)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: "var(--font-size-sm)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBin(binId)}
                    className="btn"
                    style={{ 
                      flex: 1, 
                      fontSize: "var(--font-size-sm)",
                      background: "var(--warning-red)",
                      color: "var(--white)",
                      border: "none"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operators Tab */}
      {activeTab === 'operators' && (
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "var(--space-lg)" 
          }}>
            <h2 style={{ margin: "0", fontSize: "var(--font-size-xl)", color: "var(--text-primary)" }}>
              Operators ({Object.keys(operators).length})
            </h2>
            <button
              onClick={() => {
                setEditingOperator(null);
                setOperatorForm({ id: '', name: '', email: '', phone: '', assignedBins: [] });
                setShowOperatorForm(true);
              }}
              className="btn btn-primary"
            >
              + Add New Operator
            </button>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "var(--space-lg)" 
          }}>
            {Object.entries(operators).map(([operatorId, operator]) => (
              <div key={operatorId} className="card" style={{ padding: "var(--space-lg)" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "var(--space-md)" 
                }}>
                  <h3 style={{ margin: "0", fontSize: "var(--font-size-lg)", color: "var(--text-primary)" }}>
                    {operator.name}
                  </h3>
                  <span className="status-indicator status-normal">
                    Active
                  </span>
                </div>

                <div style={{ marginBottom: "var(--space-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Email:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>{operator.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Phone:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>{operator.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Assigned Bins:</span>
                    <span style={{ fontWeight: "500", fontSize: "var(--font-size-sm)" }}>
                      {operator.assignedBins?.length || 0}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <button
                    onClick={() => handleEditOperator(operatorId)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: "var(--font-size-sm)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOperator(operatorId)}
                    className="btn"
                    style={{ 
                      flex: 1, 
                      fontSize: "var(--font-size-sm)",
                      background: "var(--warning-red)",
                      color: "var(--white)",
                      border: "none"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bin Form Modal */}
      {showBinForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '90%', 
            maxWidth: '500px', 
            padding: 'var(--space-lg)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: "0 0 var(--space-lg) 0", fontSize: "var(--font-size-xl)" }}>
              {editingBin ? 'Edit Bin' : 'Add New Bin'}
            </h3>
            
            <form onSubmit={handleBinSubmit}>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Bin ID
                </label>
                <input
                  type="text"
                  value={binForm.id}
                  onChange={(e) => setBinForm({...binForm, id: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={binForm.name}
                  onChange={(e) => setBinForm({...binForm, name: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Location
                </label>
                <input
                  type="text"
                  value={binForm.location}
                  onChange={(e) => setBinForm({...binForm, location: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Capacity (kg)
                </label>
                <input
                  type="number"
                  value={binForm.capacity}
                  onChange={(e) => setBinForm({...binForm, capacity: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-lg)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Operator
                </label>
                <select
                  value={binForm.operatorId}
                  onChange={(e) => setBinForm({...binForm, operatorId: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                >
                  <option value="">Select Operator</option>
                  {Object.entries(operators).map(([id, operator]) => (
                    <option key={id} value={id}>{operator.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingBin ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowBinForm(false)}
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operator Form Modal */}
      {showOperatorForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '90%', 
            maxWidth: '500px', 
            padding: 'var(--space-lg)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: "0 0 var(--space-lg) 0", fontSize: "var(--font-size-xl)" }}>
              {editingOperator ? 'Edit Operator' : 'Add New Operator'}
            </h3>
            
            <form onSubmit={handleOperatorSubmit}>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Operator ID
                </label>
                <input
                  type="text"
                  value={operatorForm.id}
                  onChange={(e) => setOperatorForm({...operatorForm, id: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={operatorForm.name}
                  onChange={(e) => setOperatorForm({...operatorForm, name: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={operatorForm.email}
                  onChange={(e) => setOperatorForm({...operatorForm, email: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ marginBottom: "var(--space-lg)" }}>
                <label style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: "500" }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={operatorForm.phone}
                  onChange={(e) => setOperatorForm({...operatorForm, phone: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "1px solid var(--light-gray)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingOperator ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowOperatorForm(false)}
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
