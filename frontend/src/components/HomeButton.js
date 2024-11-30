import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/'); // Redirects to the home page
  };

  return (
    <button
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000, // Ensures the button stays on top
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onClick={handleClick}
    >
      Home
    </button>
  );
};

export default HomeButton;
