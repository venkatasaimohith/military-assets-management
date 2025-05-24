import React, { useEffect, useState } from 'react';
import './PurchaseForm.css'; // Make sure this file exists and is styled

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/purchases', {
        headers: { Authorization: `Bearer ${token} `},
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setPurchases(data);
      } else if (data?.purchases) {
        setPurchases(data.purchases);
      } else {
        console.warn('Unexpected format:', data);
        setPurchases([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleAddPurchase = async () => {
    const token = localStorage.getItem('token');
    if (!baseId || !assetId || !equipmentType || !quantity || !date) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/purchases/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base_id: baseId,
          asset_id: assetId,
          equipment_type: equipmentType,
          quantity,
          date,
        }),
      });

      if (res.ok) {
        setBaseId('');
        setAssetId('');
        setEquipmentType('');
        setQuantity('');
        setDate('');
        fetchPurchases(); // Refresh list
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to add purchase');
      }
    } catch (err) {
      console.error('Add purchase error:', err);
      alert('Error while adding purchase',err);
    }
  };

  return (
    <div>
      <h2>Purchase History</h2>

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
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Base ID</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Equipment Type</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((item, idx) => (
              <tr key={idx}>
                <td>{item.asset_id}</td>
                <td>{item.base_id}</td>
                <td>{item.quantity}</td>
                <td>{item.date}</td>
                <td>{item.equipment_type || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Purchases;