import React, { useState } from 'react';
import QueryForm from '../components/QueryForm';
import TransactionsLog from '../components/TransactionsLog';
import SearchInputs from '../components/SearchInputs';
import '../styles/App.css';

const SearchPage = () => {
  const [transactions, setTransactions] = useState([]); // State to store fetched transactions
  const [searchTerm, setSearchTerm] = useState(''); // State to store search term

  const handleSearch = (query) => {
    setSearchTerm(query); // Update the search term state
  };

  // Example filter logic (if applicable):
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Search Records</h1>
      <br />
      <SearchInputs onSearch={handleSearch} />
      <br />
      <TransactionsLog transactions={filteredTransactions} />
    </div>
  );
};

export default SearchPage;
