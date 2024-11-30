import React, { useState } from 'react';
import Dropdown from './Dropdown';

const SearchInputs = (onSearch, onNodeSelect) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownTitle, setDropdownTitle] = useState('Select Node'); // Dynamic title

  const options = [
    { label: 'Node 1 (Central Node)', value: 'node1' },
    { label: 'Node 2 (< 2010)', value: 'node2' },
    { label: 'Node 3 (>= 2010)', value: 'node3' },
  ];

  // Fetch the active node from the backend
  const fetchActiveNode = async () => {
    try {
      const response = await fetch(`http://localhost:5000/active-node`);
      const data = await response.json();

      if (response.ok) {
        const activeOption = options.find((opt) => opt.value === data.node);
        setDropdownTitle(activeOption ? activeOption.label : 'Select Node');
      } else {
        console.error('Error fetching active node:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  

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

  const handleNodeSelect = async (node) => {
    console.log(`Selected Node: ${node}`);
    
    try {
      const response = await fetch(`http://localhost:5000/switch-node`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ node }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log(`Switched to Node: ${data.node}`);
        window.location.reload();

      } else {
        console.error('Error switching node:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
/*
  const options = [
    { label: 'Node 1 (Central Node)', value: 'node1' },
    { label: 'Node 2 (< 2010)', value: 'node2' },
    { label: 'Node 3 (>= 2010)', value: 'node3' },
  ];*/

  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="input-group">
          <span className="input-group-btn">
            <Dropdown
              options={options}
              title={dropdownTitle}
              onSelect={handleNodeSelect}
            />
          </span>
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
