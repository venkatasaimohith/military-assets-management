// src/components/AssignmentForm.js
import React, { useState } from 'react';
import './PurchaseForm.css';

const AssignmentForm = ({ onSuccess }) => {
  const [baseId, setBaseId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [personnel, setPersonnel] = useState('');  // ✅ use personnel
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleAssign = async () => {
    if (
      baseId.trim() === '' ||
      assetId.trim() === '' ||
      personnel.trim() === '' ||
      quantity === '' ||
      date.trim() === ''
    ) {
      setMessage('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base_id: baseId.trim(),
          asset_id: assetId.trim(),
          personnel: personnel.trim(),  // ✅ must match column name
          quantity: Number(quantity),
          date,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Assignment successful!');
        setBaseId('');
        setAssetId('');
        setPersonnel('');
        setQuantity('');
        setDate('');
        if (onSuccess) onSuccess();
      } else {
        setMessage(data.message || '❌ Assignment failed');
      }
    } catch (err) {
      console.error('Assignment error:', err);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="purchase-form-row">
      <input
        type="text"
        placeholder="Base ID"
        value={baseId}
        onChange={e => setBaseId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Asset ID"
        value={assetId}
        onChange={e => setAssetId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Personnel Name / ID"
        value={personnel}
        onChange={e => setPersonnel(e.target.value)}  // ✅ updated binding
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
      <button className="add-button" onClick={handleAssign}>Assign</button>
      {message && <p style={{ color: 'orange', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default AssignmentForm;