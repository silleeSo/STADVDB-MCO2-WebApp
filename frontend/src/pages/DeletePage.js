import React, { useState, useEffect } from 'react';
import { executeQuery } from '../services/api'; // Import executeQuery function from api.js
import TableComponent from '../components/TableComponent'; // Import the new TableComponent

const DeletePage = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch data from the database when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = 'SELECT * FROM games LIMIT 100';
      const result = await executeQuery(query);
      setTransactions(result.transactions); // Store the fetched data in state
    };

    fetchData(); // Call the function to fetch the data on mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleRowClick = async (transaction) => {
    const deleteQuery = `DELETE FROM games WHERE id = ${transaction.id}`;
    const response = await executeQuery(deleteQuery);

    if (response.success) {
      alert(`Record with ID ${transaction.id} has been deleted.`);
      // Remove the deleted record from the frontend state
      setTransactions(transactions.filter((item) => item.id !== transaction.id));
    } else {
      alert('Failed to delete record.');
    }
  };

  return (
    <div>
      <h2>Delete or Update Records</h2>
      <p>Select a record then choose to either delete or update the record!</p>
      
      <TableComponent transactions={transactions} onDelete={handleRowClick} />
    </div>
  );
};

export default DeletePage;
