const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS to allow your React frontend to make requests to this server
app.use(bodyParser.json()); // Parse JSON request bodies

// Simple route to test API
app.post('/query', (req, res) => {
  const { query } = req.body;

  // You can handle different queries here
  if (query === 'SELECT * FROM users') {
    const transactions = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    return res.json({ transactions });
  } else {
    return res.status(400).json({ error: 'Invalid query' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
