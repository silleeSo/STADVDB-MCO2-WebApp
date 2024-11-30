import React, { useEffect, useState } from 'react';
import { executeQuery } from '../services/api';
import SearchInputs from '../components/SearchInputs';
import Report1_TableComponent from '../components/Report1_TableComponent';
import report1Icon from '../assets/report1.png'; 

const Report1 = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT 
          id,
          name, 
          average_playtime_forever, 
          average_playtime_2weeks, 
          median_playtime_forever
        FROM games
        ORDER BY average_playtime_forever DESC
        LIMIT 100;
      `;
      try {
        const result = await executeQuery(query);
        setTransactions(result.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchTerm(query); 
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="text-center my-4">
        <h2>Top Games by Engagement</h2>
        <img
                src={report1Icon}
                alt="Report 1 Icon"
                className="mx-auto mb-3"
                style={{ width: '50px', height: '50px' }}
              />
      </header>
      <main>
        <section className="mb-4">
        <SearchInputs  onSearch={handleSearch} />
        </section>
        <section>
          <Report1_TableComponent transactions={filteredTransactions} />
        </section>
      </main>
    </div>
  );
};

export default Report1;
