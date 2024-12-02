import React from 'react';
import steamLogo from '../assets/steam-logo.png';

const Header = () => (
  <div className="d-flex justify-content-center align-items-center mb-4">
    <h1 className="me-3">Welcome to the Steam Games Distributed Database System!</h1>
    <img 
      src={steamLogo} 
      alt="Steam Logo" 
      style={{ width: '50px', height: '50px' }} 
    />
  </div>
);

export default Header;
