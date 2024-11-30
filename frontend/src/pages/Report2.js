import React, { useEffect, useState } from 'react';
import { executeQuery } from '../services/api';
import SearchInputs from '../components/SearchInputs';
import Report2_TableComponent from '../components/Report2_TableComponent'; // Corrected the component import
import report2Icon from '../assets/report2.png'; 

const Report2 = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT
          id,
          name,
          price,
          average_playtime_forever,
          (average_playtime_forever / price) AS playtime_per_dollar
        FROM {TABLE}
        WHERE price > 0
        ORDER BY playtime_per_dollar DESC
        LIMIT 100; -- Corrected placement of LIMIT
      `;
      try {
        const result = await executeQuery(query);
        setTransactions(result.transactions || []); // Fallback to empty array if no data is returned
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchTerm(query); // Update search term in state
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="text-center my-4">
        <h2>Revenue and Value Analysis</h2>
        <img
                src={report2Icon}
                alt="Report 2 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
      </header>
      <main>
        <section className="mb-4">
          <SearchInputs onSearch={handleSearch} />
        </section>
        <section>
          <Report2_TableComponent transactions={filteredTransactions} />
        </section>
      </main>
    </div>
  );
};

export default Report2;
