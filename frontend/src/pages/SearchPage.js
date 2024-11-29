import React, { useState } from 'react';  // <-- Add useState here
import QueryForm from '../components/QueryForm';
import TransactionsLog from '../components/TransactionsLog';
import SearchBar from '../components/SearchBar';
import '../styles/App.css'; 


const SearchPage = () => {
  const [transactions, setTransactions] = useState([]);  // useState will now work

  return (
    <div>    
      <h1>Search Records</h1>
      <br></br>
      <SearchBar/>
      <br></br>
      <TransactionsLog transactions={transactions} />
      
    </div>
  );
};

export default SearchPage;
