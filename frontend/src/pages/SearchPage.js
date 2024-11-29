import React, { useState } from 'react';  // <-- Add useState here
import QueryForm from '../components/QueryForm';
import TransactionsLog from '../components/TransactionsLog';
import '../styles/App.css'; 


const SearchPage = () => {
  const [transactions, setTransactions] = useState([]);  // useState will now work

  return (
    <div>    
      <h2>Welcome to My Website!</h2>
      <p>This is the SEARCH.</p>
      <QueryForm setTransactions={setTransactions} />
      <TransactionsLog transactions={transactions} />
    </div>
  );
};

export default SearchPage;
