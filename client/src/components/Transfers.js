// src/components/Transfers.js
import React, { useEffect, useState } from 'react';
import TransferForm from './TransferForm'; // ✅ Import form

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const token = localStorage.getItem('token');

  // ✅ Fetch Transfers
  const fetchTransfers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transfers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('Fetched transfers:', data); // Debug
      setTransfers(Array.isArray(data.transfers) ? data.transfers : []);
    } catch (err) {
      console.error('Error fetching transfers:', err.message);
      setTransfers([]);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div className="transfers-page" style={{ padding: '20px' }}>
      <h2>Transfer History</h2>

      {/* ✅ Add Transfer Form */}
      <div style={{ marginBottom: '20px' }}>
        <TransferForm onSuccess={fetchTransfers} />
      </div>

      {transfers.length === 0 ? (
        <p>No transfers found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>From Base</th>
              <th>To Base</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer, index) => (
              <tr key={index}>
                <td>{transfer.asset_id}</td>
                <td>{transfer.from_base_id}</td>
                <td>{transfer.to_base_id}</td>
                <td>{transfer.quantity}</td>
                <td>{transfer.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transfers;