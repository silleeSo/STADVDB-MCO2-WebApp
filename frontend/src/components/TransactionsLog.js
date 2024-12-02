import React from 'react';
import '../styles/TransactionsLog.css';

const TransactionsLog = ({ transactions }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Release Date</th>
          <th>Release Year</th>
          <th>Price</th>
          <th>Positive Reviews</th>
          <th>Negative Reviews</th>
          <th>User Score</th>
          <th>Metacritic Score</th>
          <th>Average Playtime Forever</th>
          <th>Average Playtime 2 Weeks</th>
          <th>Median Playtime Forever</th>
          <th>Node</th> {/* New column for Node */}
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.release_date}</td>
              <td>{transaction.release_year}</td>
              <td>{transaction.price}</td>
              <td>{transaction.positive_reviews}</td>
              <td>{transaction.negative_reviews}</td>
              <td>{transaction.user_score}</td>
              <td>{transaction.metacritic_score}</td>
              <td>{transaction.average_playtime_forever}</td>
              <td>{transaction.average_playtime_2weeks}</td>
              <td>{transaction.median_playtime_forever}</td>
              <td>{transaction.node}</td> {/* Display the Node */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="13">No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TransactionsLog;
