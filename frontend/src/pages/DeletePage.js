import React, { useState, useEffect } from 'react';
import { executeQuery } from '../services/api'; // Import executeQuery function from api.js
import TableComponent from '../components/TableComponent'; // Import the new TableComponent

const DeletePage = () => {
  const [transactions, setTransactions] = useState([]);

  // Function to fetch data
  const fetchData = async () => {
    const query = 'SELECT * FROM games LIMIT 100';
    const result = await executeQuery(query);
    setTransactions(result.transactions); // Store the fetched data in state
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleDelete = async (transaction) => {
    const deleteQuery = `DELETE FROM games WHERE id = ${transaction.id}`;
    const response = await executeQuery(deleteQuery);

    if (response.success) {
      alert(`Record with ID ${transaction.id} has been deleted.`);
      // Option 1: Update state (current implementation)
      //setTransactions(transactions.filter((item) => item.id !== transaction.id));

      // Option 2: Refresh the entire table from the backend
      // Uncomment the line below if you want to refresh from the server:
      await fetchData();
    } else {
      alert('Failed to delete record.');
    }

    await fetchData();
  };

  return (
    <div>
      <h2>Delete or Update Records</h2>
      <p>Select a record then choose to either delete or update the record!</p>
      
      <TableComponent transactions={transactions} onDelete={handleDelete} />
    </div>
  );
};

export default DeletePage;
