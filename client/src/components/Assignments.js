import React, { useEffect, useState, useCallback } from 'react';
import AssignmentForm from './AssignmentForm';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem('token');

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error('Error fetching assignments:', err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div>
      <h2>Asset Assignments</h2>

      {/* Add New Assignment Form in one line format */}
      <AssignmentForm onSuccess={fetchAssignments} />

      {/* Assignment Table */}
      {assignments.length === 0 ? (
        <p>No assignment records found.</p>
      ) : (
        <table>
  <thead>
    <tr>
      <th>Asset ID</th>
      <th>Base ID</th>
      <th>Personnel ID</th>   {/* This is fine */}
      <th>Quantity</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {assignments.map((row, index) => (
      <tr key={index}>
        <td>{row.asset_id}</td>
        <td>{row.base_id}</td>
        <td>{row.personnel}</td>    {/* ✅ Make sure this matches the backend field */}
        <td>{row.quantity}</td>
        <td>{row.date}</td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
};

export default Assignments;