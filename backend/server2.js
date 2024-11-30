// Importing required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cron = require('node-cron');
const shell = require('shelljs');

// Create an instance of Express app
const app = express();
const port = 5000; // Port where the server will run

// Middleware to allow cross-origin requests and parse JSON bodies
app.use(cors());
app.use(express.json());

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

// Periodic health check that runs every minute to detect failed nodes and switch active node
cron.schedule('* * * * *', async () => {
  console.log('Running periodic health checks...');

  // Skip health checks if manual node switching is in progress
  if (failedNodes[activeNodeConfig] !== true) {
    // Check each node's health by pinging the database
    for (const [nodeName, nodeConfig] of Object.entries(dbNodes)) {
      const connection = createDbConnection(nodeConfig);

      connection.ping((err) => {
        if (err) {
          console.error(`${nodeName} is down: ${err.message}`);
          failedNodes[nodeName] = true; // Mark node as failed
        } else {
          console.log(`${nodeName} is healthy`);
          failedNodes[nodeName] = false; // Mark node as healthy
        }
        connection.end();
      });
    }
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

// Route to simulate node recovery
app.post('/simulate-recovery', async (req, res) => {
  const { node } = req.body;
  if (!dbNodes[node]) return res.status(400).json({ error: 'Invalid node selection' });

  const success = await recoverNode(node);
  failedNodes[node] = !success; // Update failure status
  res.json({ message: success ? `${node} recovered successfully` : `Failed to recover ${node}` });
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

  // Map the active node to the appropriate table
  const tableName = tableMapping[Object.keys(dbNodes).find(key => dbNodes[key] === activeNodeConfig)];
  if (!tableName) return res.status(400).json({ error: 'No table mapped to active node.' });

  const dynamicQuery = query.replace('{TABLE}', tableName); // Replace placeholder with the actual table name

  // Check if node1 is down, and reroute query accordingly
  if (failedNodes['node1']) {
    console.log('Node1 is down, rerouting query...');
    const availableNode = Object.keys(dbNodes).find(node => !failedNodes[node]);
    if (availableNode) {
      activeNodeConfig = dbNodes[availableNode];
      console.log(`Rerouting query to ${availableNode}`);
      const connection = createDbConnection(dbNodes[availableNode]);
      connection.query(dynamicQuery, (err, results) => {
        if (err) return res.status(500).json({ error: 'Query failed on rerouted node' });
        res.json({ transactions: results });
      });
    } else {
      return res.status(503).json({ error: 'No available node to reroute query' });
    }
  } else {
    db.query(dynamicQuery, (err, results) => {
      if (err) return res.status(500).json({ error: 'Query failed' });
      res.json({ transactions: results });
    });
  }
});

// Start the server and listen on port 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
