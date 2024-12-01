// Importing required modules
const express = require('express'); // Web framework for building the API
const mysql = require('mysql2'); // MySQL database connector
const cors = require('cors'); // Middleware for Cross-Origin Resource Sharing
const cron = require('node-cron'); // Scheduler for periodic tasks
const shell = require('shelljs'); // Shell commands utility

// Create an instance of the Express app
const app = express();
const port = 5000; // Define the port on which the server will run

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Database node configurations for three different MySQL servers
const dbNodes = {
  node1: { 
    host: '127.0.0.1', 
    port: 3300, 
    user: 'root', 
    password: 'erdana2003', 
    database: 'mco_db' 
  },
  node2: { 
    host: '127.0.0.1', 
    port: 3306, 
    user: 'root', 
    password: 'erdana2003', 
    database: 'mco_db' 
  },
  node3: { 
    host: '127.0.0.1', 
    port: 3307, 
    user: 'root', 
    password: 'erdana2003', 
    database: 'mco_db' 
  },
};

let activeNodeConfig = dbNodes.node1; // Default active node
const failedNodes = {}; // Object to track failed nodes
// Transaction queue and failed replication tracking
let transactionQueue = []; // Stores failed transactions that need to be retried


// Function to create a database connection
function createDbConnection(nodeConfig) {
  const connection = mysql.createConnection({
    host: nodeConfig.host,
    port: nodeConfig.port,
    user: nodeConfig.user,
    password: nodeConfig.password,
    database: nodeConfig.database
  });

  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to ${nodeConfig.host}:${nodeConfig.port}`, err);
      return;
    }
    console.log(`Connected to MySQL on port ${connection.config.port}`);
    connection.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ', (err) => {
      if (err) {
        console.error('Error setting isolation level:', err);
      } else {
        connection.query('SELECT @@global.transaction_isolation', (err, results) => {
          if (err) {
            console.error('Error fetching isolation level:', err);
          } else {
            console.log('Current Isolation Level:', results[0]['@@global.transaction_isolation']);
          }
        });
      }
    });
  });

  return connection;
}

// Retry logic for replication failures (Node 2 or Node 3 to central node and Node 2 or Node 3 replication failure)
async function retryReplication(transaction, targetNode) {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const connection = createDbConnection(targetNode);
      await executeReplication(transaction, connection);
      console.log(`Transaction replicated successfully to ${targetNode.host}`);
      return true;
    } catch (err) {
      console.error(`Error replicating transaction to ${targetNode.host}`, err);
      attempt++;
      await delay(2000); // Delay before retrying
    }
  }

  console.log(`Failed to replicate transaction to ${targetNode.host} after ${maxRetries} attempts`);
  return false;
}

// Function to execute the global transaction
async function executeGlobalTransaction(transaction, connection) {
  connection.beginTransaction((err) => {
    if (err) throw err;

    // Simulate global transaction execution
    connection.query(transaction.query, (err, results) => {
      if (err) {
        connection.rollback();
        throw err;
      } else {
        connection.commit((err) => {
          if (err) {
            connection.rollback();
            throw err;
          }
          console.log('Global transaction executed successfully');
        });
      }
    });
  });
}

// Function to replicate the transaction to other nodes
async function replicateTransaction(transaction) {
  try {
    const replicationNodes = [dbNodes.node2, dbNodes.node3];
    for (const node of replicationNodes) {
      const replicationSuccess = await retryReplication(transaction, node);
      if (!replicationSuccess) {
        return false; // Replication failed
      }
    }
    return true; // Replication succeeded
  } catch (err) {
    console.error('Error during replication', err);
    return false; // Replication failed
  }
}

// Function to process failed transactions and retry
async function processFailedTransactions() {
  for (const transaction of transactionQueue) {
    try {
      const replicationSuccess = await replicateTransaction(transaction);
      if (replicationSuccess) {
        // If replication is successful, remove from queue
        transactionQueue = transactionQueue.filter(t => t !== transaction);
      }
    } catch (err) {
      console.error('Error retrying failed transaction', err);
    }
  }
}

// Cron job to periodically retry failed transactions
cron.schedule('* * * * *', async () => {
  console.log('Retrying failed transactions...');
  await processFailedTransactions();
});

// Periodic health check that runs every minute to detect failed nodes and switch active node
cron.schedule('* * * * *', async () => {
  console.log('Running periodic health checks...');

  for (const [nodeName, nodeConfig] of Object.entries(dbNodes)) {
    const connection = createDbConnection(nodeConfig);
    connection.ping(async (err) => {
      if (err) {
        if (!failedNodes[nodeName]) {
          console.error(`${nodeName} is down: ${err.message}`);
          failedNodes[nodeName] = true;
        }
      } else {
        if (failedNodes[nodeName]) {
          console.log(`${nodeName} has recovered.`);
          failedNodes[nodeName] = false;

          if (nodeName === 'node1') {
            console.log('Central node recovered. Processing transaction queue...');
            await processTransactionQueueImmediatelyWithLogs();
          } else {
            console.log(`Node ${nodeName} recovered. Attempting immediate replication of pending transactions.`);
            await processPendingTransactionsForNode(nodeConfig);
          }
        } else {
          console.log(`${nodeName} is healthy.`);
        }
      }

      connection.end();
    });
  }
});

// Function to get the active database connection
function getActiveConnection() {
  const connection = createDbConnection(activeNodeConfig);
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return;
    }
    console.log('Connected to MySQL on port', connection.config.port);
    connection.query('SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ', (err) => {
      if (err) {
        console.error('Error setting isolation level:', err);
        return;
      }
      connection.query('SELECT @@global.transaction_isolation', (err, results) => {
        if (err) {
          console.error('Error fetching isolation level:', err);
        } else {
          console.log('Current Isolation Level:', results[0]['@@global.transaction_isolation']);
        }
      });
    });
  });
  return connection;
}

// Set default connection to the active node
let db = getActiveConnection();

// Route to switch active node (manual selection)
app.post('/switch-node', (req, res) => {
  const { node } = req.body;
  if (!node || !dbNodes[node]) return res.status(400).json({ error: 'Invalid node selection' });

  // Check if the selected node is down, and switch to another available node if necessary
  if (failedNodes[node]) {
    console.log(`${node} is down, automatically switching to available node.`);
    
    // Switch to another node if the current node is down
    if (node === 'node1') {
      if (!failedNodes['node2']) {
        activeNodeConfig = dbNodes['node2'];
      } else if (!failedNodes['node3']) {
        activeNodeConfig = dbNodes['node3'];
      } else {
        return res.status(503).json({ error: 'No available node to switch to.' });
      }
    } else if (node === 'node2') {
      if (!failedNodes['node3']) {
        activeNodeConfig = dbNodes['node3'];
      } else if (!failedNodes['node1']) {
        activeNodeConfig = dbNodes['node1'];
      } else {
        return res.status(503).json({ error: 'No available node to switch to.' });
      }
    } else if (node === 'node3') {
      if (!failedNodes['node2']) {
        activeNodeConfig = dbNodes['node2'];
      } else if (!failedNodes['node1']) {
        activeNodeConfig = dbNodes['node1'];
      } else {
        return res.status(503).json({ error: 'No available node to switch to.' });
      }
    }
  } else {
    activeNodeConfig = dbNodes[node]; // Switch to the selected node
  }

  db = getActiveConnection(); // Reconnect to the newly selected node
  console.log(`Switched to ${node}`);
  res.json({ message: 'Node switched successfully', node });
});

// Route to simulate a node failure
app.post('/simulate-failure', (req, res) => {
  const { node } = req.body;
  if (!dbNodes[node]) return res.status(400).json({ error: 'Invalid node selection' });

  failedNodes[node] = true; // Mark the node as failed
  console.log(`${node} marked as failed`);
  res.json({ message: `${node} marked as failed` });
});

// Function to process transactionQueue immediately when central node recovers
async function processTransactionQueueImmediately() {
  console.log("Processing transactionQueue immediately as central node recovered...");
  
  for (const transaction of transactionQueue) {
    try {
      const replicationSuccess = await replicateTransaction(transaction);
      if (replicationSuccess) {
        // If replication is successful, remove from the queue
        transactionQueue = transactionQueue.filter(t => t !== transaction);
        console.log("Transaction processed successfully and removed from queue.");
      }
    } catch (err) {
      console.error("Error processing transaction during immediate recovery handling", err);
    }
  }
}

// Function to process transactions targeting a specific node
async function processPendingTransactionsForNode(recoveredNodeConfig) {
  console.log(`Processing pending transactions for recovered node: ${recoveredNodeConfig.host}`);

  // Filter transactions targeting the recovered node
  const transactionsForNode = transactionQueue.filter(transaction => 
    transaction.targetNode.host === recoveredNodeConfig.host
  );

  for (const transaction of transactionsForNode) {
    try {
      // Attempt to replicate transaction to the recovered node
      const connection = createDbConnection(recoveredNodeConfig);
      await executeReplication(transaction, connection);

      // Remove successfully processed transaction from the queue
      transactionQueue = transactionQueue.filter(t => t !== transaction);
      console.log(`Transaction successfully replicated to ${recoveredNodeConfig.host}`);
    } catch (err) {
      console.error(`Error replicating transaction to ${recoveredNodeConfig.host}`, err);
    }
  }
}

// Function to process transaction queue with detailed logs
async function processTransactionQueueImmediatelyWithLogs() {
  console.log('Starting immediate processing of the transaction queue...');
  console.log(`Queue length: ${transactionQueue.length}`);

  if (transactionQueue.length === 0) {
    console.log('Transaction queue is empty. Nothing to process.');
    return;
  }

  for (const transaction of transactionQueue) {
    try {
      const success = await replicateTransaction(transaction);
      if (success) {
        // Remove successful transactions from the queue
        transactionQueue = transactionQueue.filter(t => t !== transaction);
        console.log(`Transaction successfully processed: ${transaction.query}`);
      } else {
        console.warn(`Transaction failed and remains in queue: ${transaction.query}`);
      }
    } catch (err) {
      console.error(`Error processing transaction: ${transaction.query}`, err);
    }
  }

  console.log('Transaction queue processing completed.');
}

// Route to simulate node recovery
app.post('/simulate-recovery', async (req, res) => {
  const { node } = req.body;
  if (!dbNodes[node]) {
    return res.status(400).json({ error: 'Invalid node selection' });
  }

  console.log(`Attempting to recover node: ${node}`);
  const success = await recoverNode(node);
  failedNodes[node] = !success;

  if (success) {
    console.log(`${node} successfully recovered.`);
    
    if (node === 'node1') {
      console.log('Central node recovered. Processing transaction queue...');
      await processTransactionQueueImmediatelyWithLogs();
    } else {
      console.log(`Node ${node} recovered. Attempting immediate replication of pending transactions.`);
      const recoveredNodeConfig = dbNodes[node];
      await processPendingTransactionsForNode(recoveredNodeConfig);
    }
  } else {
    console.error(`Failed to recover ${node}. It remains marked as failed.`);
  }

  res.json({
    message: success ? `${node} recovered successfully` : `Failed to recover ${node}`,
  });
});

// Route to get the active node configuration
app.get('/active-node', (req, res) => {
  res.json({ activeNode: activeNodeConfig });
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
  const tableMapping = {
    node1: 'games',
    node2: 'games_before_2010',
    node3: 'games_2010_and_after',
  };

  const tableName = tableMapping[Object.keys(dbNodes).find(key => dbNodes[key] === activeNodeConfig)];
  if (!tableName) return res.status(400).json({ error: 'No table mapped to active node.' });

  const dynamicQuery = query.replace('{TABLE}', tableName); // Replace placeholder with the actual table name

  try {
    const connection = createDbConnection(activeNodeConfig);
    connection.query(dynamicQuery, async (err, results) => {
      if (err) {
        console.error('Transaction failed, adding to retry queue', err);
        transactionQueue.push({ query: dynamicQuery }); // Add failed transaction to the queue
        return res.status(500).json({ error: 'Query failed on active node' });
      }
      res.json({ transactions: results });
    });
  } catch (err) {
    console.error('Error executing transaction', err);
    return res.status(500).json({ error: 'Failed to execute query' });
  }
});

// Delete data from MySQL
app.delete('/delete-record', (req, res) => {
  const { id } = req.params;
  
  // Make sure 'id' is a valid number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Perform the database query
  db.query('DELETE FROM games WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Failed to delete record' });
    }
    
    // If no rows are deleted, handle the case where the ID was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  });
});

// Add data to MySQL -- double check if it works
app.post('/add-record', (req, res) => {
  const data = req.body;

  const query = `
    INSERT INTO games (
      name, release_date, release_year, price, positive_reviews,
      negative_reviews, user_score, metacritic_score, average_playtime_forever,
      average_playtime_2weeks, median_playtime_forever
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    data.field1, data.field2, data.field3, data.field4, data.field5,
    data.field6, data.field7, data.field8, data.field9, data.field10, data.field11,
  ]; 
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Failed to add record.');
    }
    res.status(200).send('Record added successfully.');
  });
});

// Update data in MySQL - doesn't work on my end
app.put('/update-record', async (req, res) => {
  const data = req.body;

  // Validate required fields
  if (!data.field1) {
    return res.status(400).json({ error: 'ID is required for update' });
  }

  const query = `
    UPDATE games
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
    data.field2, data.field3, data.field4, data.field5,
    data.field6, data.field7, data.field8, data.field9,
    data.field10, data.field11, data.field12, data.field1, // Ensure the ID is included at the end
  ];

  try {
    // Execute query
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error updating record:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.status(200).json({ message: 'Record updated successfully' });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server and listen on port 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
