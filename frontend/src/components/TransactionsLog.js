import React from 'react';
import '../styles/TransactionsLog.css'; 

function TransactionsLog({ transactions }) {
  return (
    <div>
      <h2>Transaction Logs</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction}</li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsLog;
