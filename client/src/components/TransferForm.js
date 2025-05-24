// src/components/TransferForm.js
import React, { useState } from 'react';
import './TransferForm.css';

const TransferForm = ({ onSuccess }) => {
  const [fromBase, setFromBase] = useState('');
  const [toBase, setToBase] = useState('');
  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async () => {
    if (!fromBase || !toBase || !assetId || !quantity || !date) {
      setMessage('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from_base_id: fromBase.trim(),
          to_base_id: toBase.trim(),
          asset_id: assetId.trim(),
          quantity: Number(quantity),
          date,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Transfer successful');
        setFromBase('');
        setToBase('');
        setAssetId('');
        setQuantity('');
        setDate('');
        onSuccess(); // Refresh the transfer list
      } else {
        setMessage(data.message || '❌ Transfer failed');
      }
    } catch (err) {
      console.error('Transfer error:', err);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="transfer-form-row">
      <input
        type="text"
        placeholder="From Base ID"
        value={fromBase}
        onChange={e => setFromBase(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Base ID"
        value={toBase}
        onChange={e => setToBase(e.target.value)}
      />
      <input
        type="text"
        placeholder="Asset ID"
        value={assetId}
        onChange={e => setAssetId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <button className="transfer-button" onClick={handleTransfer}>
        Transfer
      </button>

      {message && <p style={{ color: 'orange', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default TransferForm;