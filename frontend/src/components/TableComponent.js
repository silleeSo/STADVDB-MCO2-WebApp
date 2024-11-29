import React from 'react';

const TableComponent = ({ transactions, onRowClick }) => {
  return (
    <table className="table">
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
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction.id} onClick={() => onRowClick(transaction)}>
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
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableComponent;
