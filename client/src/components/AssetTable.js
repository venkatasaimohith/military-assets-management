import React, { useEffect, useState } from 'react';

const AssetTable = () => {
  const [assets, setAssets] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (err) {
        console.error('Error fetching assets:', err.message);
      }
    };

    fetchAssets();
  }, [token]);

  return (
    <div className="asset-table">
      <h2>Full Asset Overview</h2>
      {assets.length === 0 ? (
        <p>No asset data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
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
            {assets.map((item, idx) => {
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
                  <td>{netMovement}</td>
                  <td>{item.closing_balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssetTable;