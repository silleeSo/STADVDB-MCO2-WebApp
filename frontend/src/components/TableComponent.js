import React, { useState } from 'react';

const TableComponent = ({ transactions, onDelete, onUpdate }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  
  const handleRowClick = (id) => {
    setSelectedRow(id); // Highlight selected row
  };

  return (
    <table className="table" class="table table-striped">
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr
              key={transaction.id}
              //onClick={() => handleRowClick(transaction)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRow === transaction.id ? '#f8d7da' : 'transparent',
              }}
            >
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
              <td>
              <p></p>
                <button
                  className="btn btn-success btn-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row selection
                    onUpdate(transaction.id);
                  }}
                >
                  Update
                </button>
                <p></p>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering row selection
                    onDelete(transaction);
                  }}
                >
                  Delete
                </button>
                <p></p>
              </td>
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

export default TableComponent;
