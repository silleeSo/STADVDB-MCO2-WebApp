import React, { useState } from 'react';
import QueryForm from './components/QueryForm';
import TransactionsLog from './components/TransactionsLog';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  return (
    <div className="App">
      <h1>Distributed Database System</h1>
      <QueryForm setTransactions={setTransactions} />
      <TransactionsLog transactions={transactions} />
    </div>
  );
}

export default App;
