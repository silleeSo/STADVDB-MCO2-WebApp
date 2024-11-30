import React from 'react';

const Report1_TableComponent = ({ transactions }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Average Playtime Forever</th>
          <th>Average Playtime 2 Weeks</th>
          <th>Median Playtime Forever</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.average_playtime_forever}</td>
              <td>{transaction.average_playtime_2weeks}</td>
              <td>{transaction.median_playtime_forever}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Report1_TableComponent;
