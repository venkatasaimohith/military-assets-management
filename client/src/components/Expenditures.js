// src/components/Expenditures.js
import React, { useEffect, useState } from 'react';
import ExpenditureForm from './ExpenditureForm';

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const token = localStorage.getItem('token');

  const fetchExpenditures = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/expenditures', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setExpenditures(data.expenditures || []);
    } catch (err) {
      console.error('Error fetching expenditures:', err.message);
    }
  };

  useEffect(() => {
    fetchExpenditures();
  }, []);

  return (
    <div>
      <h2>Expenditures</h2>
      <ExpenditureForm onSuccess={fetchExpenditures} />

      {expenditures.length === 0 ? (
        <p>No expenditure records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Base ID</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenditures.map((item, idx) => (
              <tr key={idx}>
                <td>{item.asset_id}</td>
                <td>{item.base_id}</td>
                <td>{item.quantity}</td>
                <td>{item.reason}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Expenditures;