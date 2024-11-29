import React from 'react';

const Dropdown = ({ options, title }) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-default dropdown-toggle"
        type="button"
        id="dropdownMenu1"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {title}
        <span className="caret"></span>
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
        {options.map((option, index) => (
          <li key={index}>
            <a className="dropdown-item" href={option.href}>
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
