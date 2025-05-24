import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchases from './components/purchases.js'; // ✅ Import Purchases page
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import Expenditures from './components/Expenditures';
import AssetTable from './components/AssetTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchases" element={<Purchases />} /> {/* ✅ Add route for Purchases */}
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/expenditures" element={<Expenditures />} />
        <Route path="/assets" element={<AssetTable />} />
      </Routes>
    </Router>
  );
}

export default App;
