import React from 'react';

const Report3_TableComponent = ({ transactions }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Positive Reviews</th>
          <th>Negative Reviews</th>
          <th>User Score</th>
          <th>Metacritic Score</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => {
            // Safely handle missing or invalid values for reviews and scores
            const positiveReviews = transaction.positive_reviews || 0;
            const negativeReviews = transaction.negative_reviews || 0;
            const userScore = transaction.user_score && !isNaN(transaction.user_score)
              ? parseFloat(transaction.user_score)
              : 'N/A';
            const metacriticScore = transaction.metacritic_score && !isNaN(transaction.metacritic_score)
              ? parseFloat(transaction.metacritic_score)
              : 'N/A';

            return (
              <tr key={index}>
                <td>{transaction.id}</td>
                <td>{transaction.name}</td>
                <td>{positiveReviews}</td>
                <td>{negativeReviews}</td>
                <td>{userScore !== 'N/A' ? userScore.toFixed(2) : userScore}</td>
                <td>{metacriticScore !== 'N/A' ? metacriticScore.toFixed(2) : metacriticScore}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Report3_TableComponent;
