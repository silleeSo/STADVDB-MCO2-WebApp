// TableComponent.js
import React from 'react';

const TableComponent = ({ transactions, onRowClick }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction.id} onClick={() => onRowClick(transaction)}>
              <td>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.email}</td>
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
