const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MySQL connection
const db = mysql.createConnection({
  //host: 'localhost', // Adjust based on your MySQL server
  //user: 'root', // Your MySQL username
  //user: 'user',
  //password: '6761', // Your MySQL password
  //database: 'mco2_games_master',    // Your MySQL database name
  //port: 3306                        // Set port to 80 if MySQL is listening on port 80   
  host: 'ccscloud.dlsu.edu.ph',        // Hostname or IP address of the MySQL server
  port: 20302,                         // External port for MySQL
  user: 'user',                        // MySQL user
  password: 'password',
  database: 'mco_db'                   // The database you want to connect to
});


// Configuration for each database node
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

// Function to create a database connection dynamically
function createConnection(nodeConfig) {
  return mysql.createConnection({
    host: nodeConfig.host,
    port: nodeConfig.port,
    user: nodeConfig.user,
    password: nodeConfig.password,
    database: nodeConfig.database
  });
}

// Example: Switch based on some condition
function switchNode(nodeKey) {
  // Check if the node configuration exists
  if (!dbNodes[nodeKey]) {
    console.error(`Node configuration for ${nodeKey} not found`);
    return null;
  }

  // Create a new connection
  const connection = createConnection(dbNodes[nodeKey]);

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to ${nodeKey}:`, err);
      return;
    }
    console.log(`Connected to ${nodeKey}`);
    
    // Run a simple query as a test
    connection.query('SELECT COUNT(*) AS count FROM games', (err, results) => {
      if (err) {
        console.error(`Error running query on ${nodeKey}:`, err);
        return;
      }
      console.log(`Records in TABLE games on ${nodeKey}:`, results[0].count);
      
      // Close the connection when done
      connection.end((err) => {
        if (err) {
          console.error(`Error closing connection for ${nodeKey}:`, err);
          return;
        }
        console.log(`Connection to ${nodeKey} closed.`);
      });
    });
  });
}

// Establish a connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL on port 20302 as id ' + db.threadId);
});


// Add and delete record routes will also use `getActiveConnection()`
// Use the same approach to fetch a connection and run the queries


// Example route to fetch data
app.get('/data', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM games', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
    console.log('Records in TABLE games:', results[0].count);
  });
});

// Route to execute a query

app.post('/query', (req, res) => {
  const { query } = req.body;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to execute query' });
    }
    res.json({ transactions: results }); // Send back the result as "transactions"
  });
});

// Add data to MYSQL
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


// Update record endpoint
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

// Route to handle node switching
app.post('/switch-node', (req, res) => {
  const { node } = req.body;

  if (!node || !dbNodes[node]) {
    return res.status(400).json({ error: 'Invalid node selection' });
  }

  // Switch the node
  const connection = createConnection(dbNodes[node]);
  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to ${node}:`, err);
      return res.status(500).json({ error: 'Failed to connect to the selected node' });
    }

    console.log(`Switched to ${node}`);
    connection.end(); // Close the connection after verification

    res.json({ message: 'Node switched successfully', node });
  });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
