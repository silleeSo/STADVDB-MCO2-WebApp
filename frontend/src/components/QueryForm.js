import React, { useState } from 'react';
import { executeQuery } from '../services/api';
import '../styles/QueryForm.css'; 

function QueryForm({ setTransactions }) {
  const [query, setQuery] = useState('');

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    const response = await executeQuery(query);
    setTransactions(response.transactions);
  };

  return (
    <form onSubmit={handleQuerySubmit}>
      <label>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="SELECT * FROM games WHERE release_year >= 2010;"
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

export default QueryForm;
