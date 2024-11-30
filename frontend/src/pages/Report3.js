import React, { useEffect, useState } from 'react';
import { executeQuery } from '../services/api';
import SearchInputs from '../components/SearchInputs';
import Report3_TableComponent from '../components/Report3_TableComponent'; // Corrected the component import
import report3Icon from '../assets/report3.png'; 
const Report3 = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT
          id,
          name,
          positive_reviews,
          negative_reviews,
          user_score,
          metacritic_score
        FROM games
        ORDER BY user_score DESC, positive_reviews DESC
        LIMIT 10;
      `; // Updated SQL query to match the new requirement

      try {
        const result = await executeQuery(query);
        setTransactions(result.transactions || []); // Fallback to empty array if no data is returned
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once when the component mounts

  const handleSearch = (query) => {
    setSearchTerm(query); // Update search term in state
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="text-center my-4">
        <h2>Reviews and Ratings Correlation</h2> 
        <img
                src={report3Icon}
                alt="Report 3 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
      </header>
      <main>
        <section className="mb-4">
          <SearchInputs onSearch={handleSearch} />
        </section>
        <section>
          <Report3_TableComponent transactions={filteredTransactions} />
        </section>
      </main>
    </div>
  );
};

export default Report3;
