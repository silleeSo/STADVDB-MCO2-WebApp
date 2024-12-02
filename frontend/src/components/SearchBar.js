import React from 'react';

const SearchBar = ({ searchTerm, onSearch, searchField, onFieldChange }) => {
  return (
    <div className="search-bar d-flex align-items-center mb-4">
      {/* Dropdown for search field */}
      <select
        className="form-select me-2"
        value={searchField}
        onChange={(e) => onFieldChange(e.target.value)}
        aria-label="Search field selector"
      >
        <option value="name">Name</option>
        <option value="release_date">Release Date</option>
        <option value="release_year">Release Year</option>
        <option value="price">Price</option>
        <option value="positive_reviews">Positive Reviews</option>
        <option value="negative_reviews">Negative Reviews</option>
        <option value="user_score">User Score</option>
        <option value="metacritic_score">Metacritic Score</option>
        <option value="average_playtime_forever">Average Playtime Forever</option>
        <option value="average_playtime_2weeks">Average Playtime 2 Weeks</option>
        <option value="median_playtime_forever">Median Playtime Forever</option>
  
      </select>

      {/* Input field for search term */}
      <input
        type="text"
        className="form-control"
        placeholder={`Search by ${searchField}`}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search input"
      />
    </div>
  );
};

export default SearchBar;
