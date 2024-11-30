// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ensure correct import path
import AddPage from './pages/AddPage'; // Ensure correct import path
import DeletePage from './pages/DeletePage'; // Ensure correct import path
import UpdatePage from './pages/UpdatePage'; // Ensure correct import path
import SearchPage from './pages/SearchPage'; // Ensure correct import path
import Report1 from './pages/Report1';
import Report2 from './pages/Report2';
import Report3 from './pages/Report3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/rp1" element={<Report1 />} />
        <Route path="/rp2" element={<Report2 />} />
        <Route path="/rp3" element={<Report3 />} />
      </Routes>
    </Router>
  );
}

export default App; // Ensure default export is here
