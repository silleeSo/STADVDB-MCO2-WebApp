import React from 'react';
import Dropdown from './Dropdown';

const SearchInputs = () => {
  const handleNodeSelect = (node) => {
    console.log(`Selected Node: ${node}`);
    // Implement your logic to connect to the selected database node
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
          <span className="input-group-btn">
            <Dropdown
            options={options}
            title="Select Node"
            onSelect={handleNodeSelect}
          />
          </span>
          
        </div>
      </div>
      <div className="col-lg-6">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search for..." />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">Go!</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchInputs;
