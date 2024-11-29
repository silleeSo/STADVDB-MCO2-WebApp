// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ensure correct import path
import AddPage from './pages/AddPage'; // Ensure correct import path
import DeletePage from './pages/DeletePage'; // Ensure correct import path
import UpdatePage from './pages/UpdatePage'; // Ensure correct import path
import SearchPage from './pages/SearchPage'; // Ensure correct import path
import ReportPage from './pages/ReportPage'; // Ensure correct import path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App; // Ensure default export is here
