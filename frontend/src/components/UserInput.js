import React from 'react';

const UserInput = ({ placeholder, inputValue, onChange, addonText }) => {
  return (
    <div className="input-group input-group-sm">
      <span className="input-group-addon" id="sizing-addon3">{addonText || '@'}</span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder || 'Username'}
        aria-describedby="sizing-addon3"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default UserInput;
