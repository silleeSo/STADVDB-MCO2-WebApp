import React from 'react';

const Report2_TableComponent = ({ transactions }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Average Playtime Forever</th>
          <th>Playtime Per Dollar</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => {
            // Safely handle price and playtime_per_dollar
            const price = transaction.price && !isNaN(transaction.price) ? parseFloat(transaction.price) : 0;
            const playtimePerDollar = transaction.playtime_per_dollar && !isNaN(transaction.playtime_per_dollar)
              ? parseFloat(transaction.playtime_per_dollar)
              : 0;

            return (
              <tr key={index}>
                <td>{transaction.id}</td>
                <td>{transaction.name}</td>
                <td>{price > 0 ? price.toFixed(2) : 'N/A'}</td>
                <td>{transaction.average_playtime_forever || 'N/A'}</td>
                <td>{playtimePerDollar > 0 ? playtimePerDollar.toFixed(2) : 'N/A'}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Report2_TableComponent;
