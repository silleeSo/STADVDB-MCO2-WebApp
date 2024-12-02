// Importing required modules
const express = require('express'); // Web framework for building the API
const mysql = require('mysql2/promise'); // MySQL database connector (use promise version for async/await)
const cors = require('cors'); // Middleware for Cross-Origin Resource Sharing
const cron = require('node-cron'); // Scheduler for periodic tasks
const shell = require('shelljs'); // Shell commands utility

// Create an instance of the Express app
const app = express();
const port = process.env.NODE_ENV === 'test' ? 5001 : 5000; // Use port 5001 for testing

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Database node configurations for three different MySQL servers
const dbNodes = {
  node1: {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20302,
    user: 'user',
    password: 'password',
    database: 'mco_db'
  },
  node2: {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20312,
    user: 'user',
    password: 'password',
    database: 'mco_db'
  },
  node3: {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20322,
    user: 'user',
    password: 'password',
    database: 'mco_db'
  }
};

let activeNodeConfig = dbNodes.node1; // Default active node
const failedNodes = {}; // Object to track failed nodes
let transactionQueue = []; // Stores failed transactions that need to be retried

// Function to create a new database connection
async function createDbConnection(nodeConfig) {
  try {
    const connection = await mysql.createConnection({
      host: nodeConfig.host,
      port: nodeConfig.port,
      user: nodeConfig.user,
      password: nodeConfig.password,
      database: nodeConfig.database
    });

    await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    return connection;
  } catch (err) {
    console.error('Error creating database connection:', err);
    throw err;
  }
}

// Route to switch active node (manual selection)
app.post('/switch-node', async (req, res) => {
  const { node } = req.body;
  if (!node || !dbNodes[node]) return res.status(400).json({ error: 'Invalid node selection' });

  if (failedNodes[node]) {
    return res.status(503).json({ error: 'Selected node is currently marked as failed.' });
  } else {
    activeNodeConfig = dbNodes[node]; // Switch to the selected node
    res.json({ message: 'Node switched successfully', node });
  }
});

// Route to simulate a node failure
app.post('/simulate-failure', (req, res) => {
  const { node } = req.body;
  if (!dbNodes[node]) return res.status(400).json({ error: 'Invalid node selection' });

  failedNodes[node] = true; // Mark the node as failed
  res.json({ message: `${node} marked as failed` });
});

// Route to simulate node recovery
app.post('/simulate-recovery', async (req, res) => {
  const { node } = req.body;
  if (!dbNodes[node]) {
    return res.status(400).json({ error: 'Invalid node selection' });
  }

  failedNodes[node] = false; // Mark the node as recovered
  res.json({
    message: `${node} recovered successfully`,
  });
});

// Middleware to check if node1 is down for write operations
function checkNode1Down(req, res, next) {
  if (failedNodes['node1'] && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(503).json({ error: 'Node1 is down, system is read-only' });
  }
  next();
}

// Apply middleware to write routes only (add, update, delete operations)
app.use('/add-record', checkNode1Down);
app.use('/update-record', checkNode1Down);
app.use('/delete-record', checkNode1Down);

// Route to execute queries on the active node with dynamic table mapping
app.post('/query', async (req, res) => {
  const { query } = req.body;

  try {
    const connection = await createDbConnection(activeNodeConfig);
    const [results] = await connection.query(query);
    await connection.end(); // Close connection after query

    res.json({ transactions: results });
  } catch (err) {
    console.error('Error executing transaction', err);
    return res.status(500).json({ error: 'Failed to execute query' });
  }
});

// Route to add a record
app.post('/add-record', async (req, res) => {
  const data = req.body;

  try {
    const query = `
      INSERT INTO games (
        id, name, release_date, release_year, price, positive_reviews,
        negative_reviews, user_score, metacritic_score, average_playtime_forever,
        average_playtime_2weeks, median_playtime_forever
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.id, data.name, data.release_date, data.release_year, data.price,
      data.positive_reviews, data.negative_reviews, data.user_score,
      data.metacritic_score, data.average_playtime_forever,
      data.average_playtime_2weeks, data.median_playtime_forever
    ];

    const connection = await createDbConnection(activeNodeConfig);
    const [results] = await connection.query(query, values);
    await connection.end(); // Close connection after operation

    res.status(200).json({ message: 'Record added successfully', results });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to add record' });
  }
});

// Route to delete a record
app.delete('/delete-record/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const connection = await createDbConnection(activeNodeConfig);
    const [result] = await connection.query('DELETE FROM games WHERE id = ?', [id]);
    await connection.end(); // Close connection after operation

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Route to update a record
app.put('/update-record', async (req, res) => {
  const data = req.body;

  if (!data.id) {
    return res.status(400).json({ error: 'ID is required for update' });
  }

  const query = `
    UPDATE gamesservw
    SET
      name = ?,
      release_date = ?,
      release_year = ?,
      price = ?,
      positive_reviews = ?,
      negative_reviews = ?,
      user_score = ?,
      metacritic_score = ?,
      average_playtime_forever = ?,
      average_playtime_2weeks = ?,
      median_playtime_forever = ?
    WHERE id = ?
  `;

  const values = [
    data.name, data.release_date, data.release_year, data.price,
    data.positive_reviews, data.negative_reviews, data.user_score,
    data.metacritic_score, data.average_playtime_forever,
    data.average_playtime_2weeks, data.median_playtime_forever, data.id
  ];

  try {
    const connection = await createDbConnection(activeNodeConfig);
    const [results] = await connection.query(query, values);
    await connection.end(); // Close connection after operation

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully' });
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server and listen on the appropriate port
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Export the app for testing purposes
module.exports = app;
