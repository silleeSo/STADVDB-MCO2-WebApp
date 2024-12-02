import React, { useState, useEffect } from 'react';
import { executeQuery } from '../services/api';
import SearchBar from '../components/SearchBar';
import TransactionsLog from '../components/TransactionsLog';
import '../styles/App.css';
import HomeButton from '../components/HomeButton';
import searchIcon from '../assets/search-icon.png';

const SearchPage = () => {
  const [transactions, setTransactions] = useState([]); // Fetched transactions
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [searchField, setSearchField] = useState('name'); // Selected search field

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const query = `SELECT * FROM games WHERE ${searchField} LIKE '%${searchTerm}%' LIMIT 100`;
      const response = await executeQuery(query); 

      // Add "Node" field based on the release_year
      const transactionsWithNodes = response.transactions.map((transaction) => ({
        ...transaction,
        node: assignNode(transaction.release_year),
      }));

      setTransactions(transactionsWithNodes);
    };

    fetchData();
  }, [searchField, searchTerm]); // Refetch when the field or term changes

  // Function to determine the Node based on release year
  const assignNode = (releaseYear) => {
    if (releaseYear < 2010) {
      return 'Node 2';
    } else {
      return 'Node 3';
    }
  };

  return (
    <div>
      <HomeButton />
      
      <div className="d-flex align-items-center">
        <h1 className="mb-0 me-2">Search Records</h1> {/* Add margin-right */}
        <img
          src={searchIcon} // Use the appropriate icon for the search page, if needed
          alt="Search Icon"
          className="mb-3"
          style={{ width: '50px', height: '50px' }}
        />
      </div>
  
      <p>Search a record by entering a term and use the dropdown to select the field you want to search in. 
        This will help you quickly find the specific information you're looking for!
      </p>
      
      <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        searchField={searchField}
        onFieldChange={setSearchField}
      />
      <TransactionsLog transactions={transactions} />
    </div>
  );
  
};

export default SearchPage;
