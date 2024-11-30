import React, { useState } from 'react';
import Dropdown from './Dropdown';

const SearchInputs = ({ onSearch, onNodeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm); // Trigger the search
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm); // Trigger search on Enter key press
    }
  };

  const options = [
    { label: 'Node 1 (Central Node)', value: 'node1' },
    { label: 'Node 2 (< 2010)', value: 'node2' },
    { label: 'Node 3 (>= 2010)', value: 'node3' },
  ];

  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="input-group">
          <Dropdown options={options} title="Select Node" onSelect={onNodeSelect} />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search for..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={handleSearchClick}>
              Go!
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchInputs;
