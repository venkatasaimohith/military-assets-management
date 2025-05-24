// src/components/ExpenditureForm.js
import React, { useState } from 'react';
import './ExpenditureForm.css'; // Optional styling

const ExpenditureForm = ({ onSuccess }) => {
  const [baseId, setBaseId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleExpenditureSubmit = async () => {
    if (!baseId || !assetId || !quantity || !reason || !date) {
      alert('Please fill all fields');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/expenditures', { // ✅ fixed endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base_id: baseId.trim(),
          asset_id: assetId.trim(),
          quantity: Number(quantity),
          reason: reason.trim(),
          date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Expenditure recorded successfully!');
        setBaseId('');
        setAssetId('');
        setQuantity('');
        setReason('');
        setDate('');
        onSuccess();
      } else {
        setMessage(data.message || '❌ Error while recording expenditure');
      }
    } catch (err) {
      console.error('Expenditure error:', err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="expenditure-form-row" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
      <input type="text" placeholder="Base ID" value={baseId} onChange={e => setBaseId(e.target.value)} />
      <input type="text" placeholder="Asset ID" value={assetId} onChange={e => setAssetId(e.target.value)} />
      <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <input type="text" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button className="submit-button" onClick={handleExpenditureSubmit}>Submit</button>
      {message && <p style={{ color: 'orange', marginLeft: '10px' }}>{message}</p>}
    </div>
  );
};

export default ExpenditureForm;