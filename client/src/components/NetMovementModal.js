import React from 'react';
import './Modal.css';

const NetMovementModal = ({ item, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Net Movement Details - {item.name}</h3>
        <ul>
          <li><strong>Purchases:</strong> {item.purchases}</li>
          <li><strong>Transfers In:</strong> {item.transfers_in}</li>
          <li><strong>Transfers Out:</strong> {item.transfers_out}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NetMovementModal;