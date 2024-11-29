import React, { useState } from 'react';

const Dropdown = ({ options, title, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(title || 'Select Node');

  const handleOptionClick = (option) => {
    setSelectedOption(option.label); // Update the displayed option
    onSelect(option.value); // Pass the selected node value to the parent component
  };

  return (
    <div className="btn-group">
      <button type="button" className="btn btn-primary">{selectedOption}</button>
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="caret"></span>
        <span className="sr-only">Toggle Dropdown</span>
      </button>
      <ul className="dropdown-menu">
        {options.map((option, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
