export const executeQuery = async (query) => {
    try {
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error executing query:', error);
      return { transactions: [] };
    }
  };
  