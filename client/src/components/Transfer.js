import React, { useState } from 'react';

const Transfers = () => {
  const [form, setForm] = useState({
    from_base_id: '',
    to_base_id: '',
    asset_id: '',
    quantity: '',
    date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Record Transfer</h2>
      <input name="from_base_id" placeholder="From Base ID" onChange={handleChange} />
      <input name="to_base_id" placeholder="To Base ID" onChange={handleChange} />
      <input name="asset_id" placeholder="Asset ID" onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Transfers;