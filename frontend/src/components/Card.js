import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ to, imgSrc, title, isDisabled = false, onClick }) => (
  <div className="col">
    <Link
      to={isDisabled ? '#' : to}
      className={`text-decoration-none ${isDisabled ? 'disabled-link' : ''}`}
      onClick={(e) => {
        if (isDisabled && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className="card h-100 text-center p-3 text-black"
        style={{
          backgroundImage: 'radial-gradient(circle, #4ec7f4, #5ac4f6, #66c1f6, #72bdf6, #7dbaf5, #7cb8f4, #7bb6f3, #7ab4f2, #6bb4f1, #5bb3f1, #46b3ef, #2ab2ed)',
          backgroundSize: 'cover',
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        <img src={imgSrc} alt={`${title} Icon`} className="mx-auto mb-3" style={{ width: '50px', height: '50px' }} />
        <h5 className="card-title">{title}</h5>
      </div>
    </Link>
  </div>
);

export default Card;
