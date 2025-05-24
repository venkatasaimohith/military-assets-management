// src/components/PurchaseForm.js
import React, { useState } from 'react';
import './PurchaseForm.css';

const PurchaseForm = ({ onSuccess }) => {
  const [baseId, setBaseId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleAddPurchase = async () => {
    if (!baseId || !assetId || !equipmentType || !quantity || !date) {
      setMessage('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/purchases/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base_id: baseId.trim(),
          asset_id: assetId.trim(),
          equipment_type: equipmentType.trim(),
          quantity: Number(quantity),
          date,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Purchase added successfully!');
        setBaseId('');
        setAssetId('');
        setEquipmentType('');
        setQuantity('');
        setDate('');
        onSuccess(); // Refresh purchase list
      } else {
        setMessage(data.message || '❌ Failed to add purchase');
      }
    } catch (err) {
      console.error('Error:', err);
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
        placeholder="Equipment Type"
        value={equipmentType}
        onChange={e => setEquipmentType(e.target.value)}
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
      <button className="add-button" onClick={handleAddPurchase}>
        Add Purchase
      </button>

      {message && <p style={{ color: 'orange', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default PurchaseForm;