import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Navbar from './Navbar';
import bg from '../assets/dashboard-bg.jpg';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    baseId: '',
    equipmentType: '',
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
        fetchDashboardData(token); // initial fetch without filters
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    }
  }, []);

  const fetchDashboardData = async (token, appliedFilters = {}) => {
    try {
      const queryParams = new URLSearchParams(appliedFilters).toString();
      const res = await fetch(`http://localhost:5000/api/dashboard?${queryParams}`, {
        headers: { Authorization: `Bearer ${token} `},
      });
      const data = await res.json();
      setDashboardData(data.assets || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
    }
  };

  const handleApplyFilters = () => {
    const token = localStorage.getItem('token');
    if (token) fetchDashboardData(token, filters);
  };

  const openNetMovementModal = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAsset(null);
  };

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
        padding: '20px'
      }}
    >
      <Navbar />
      <h2>Military Asset Dashboard</h2>

      {userInfo && (
        <div className="dashboard-buttons">
          <button className="dash-btn" onClick={() => navigate('/purchases')}>Purchases</button>
          <button className="dash-btn" onClick={() => navigate('/transfers')}>Transfers</button>
          {userInfo.role === 'admin' && (
            <>
              <button className="dash-btn" onClick={() => navigate('/assignments')}>Assignments</button>
              <button className="dash-btn" onClick={() => navigate('/expenditures')}>Expenditures</button>
              <button className="dash-btn" onClick={() => navigate('/assets')}>Asset Table</button>
            </>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        <input type="text" placeholder="Base ID" value={filters.baseId} onChange={e => setFilters({ ...filters, baseId: e.target.value })} />
        <input type="text" placeholder="Equipment Type" value={filters.equipmentType} onChange={e => setFilters({ ...filters, equipmentType: e.target.value })} />
        <button onClick={handleApplyFilters} style={{ backgroundColor: 'orange', fontWeight: 'bold' }}>Apply Filters</button>
      </div>

      {userInfo && (
        <div>
          <p><strong>Role:</strong> {userInfo.role}</p>
          <p><strong>Base ID:</strong> {userInfo.baseId || 'Not Available'}</p>
        </div>
      )}

      <h3>Asset Summary</h3>
      {dashboardData.length === 0 ? (
        <p>No asset data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Opening</th>
              <th>Purchases</th>
              <th>Transfers In</th>
              <th>Transfers Out</th>
              <th>Assigned</th>
              <th>Expended</th>
              <th>Net Movement</th>
              <th>Closing</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((item, idx) => {
              const netMovement = item.purchases + item.transfers_in - item.transfers_out;
              return (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.opening_balance}</td>
                  <td>{item.purchases}</td>
                  <td>{item.transfers_in}</td>
                  <td>{item.transfers_out}</td>
                  <td>{item.assigned}</td>
                  <td>{item.expended}</td>
                  <td
                    style={{ cursor: 'pointer', color: 'orange', fontWeight: 'bold' }}
                    onClick={() => openNetMovementModal(item)}
                  >
                    {netMovement}
                  </td>
                  <td>{item.closing_balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && selectedAsset && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Net Movement Details</h4>
            <p><strong>Asset:</strong> {selectedAsset.name}</p>
            <p><strong>Purchases:</strong> {selectedAsset.purchases}</p>
            <p><strong>Transfers In:</strong> {selectedAsset.transfers_in}</p>
            <p><strong>Transfers Out:</strong> {selectedAsset.transfers_out}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;