import React from 'react';

const SearchBar = () => {
  return (
    <div className="col-lg-6">
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Search for..." />
        <div className="input-group-append"> {/* Use input-group-append to add the button correctly */}
          <button className="btn btn-primary" type="button">Search!</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
