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
  host: 'localhost', // Adjust based on your MySQL server
  user: 'root', // Your MySQL username
  password: '6761', // Your MySQL password
  database: 'mco2_games_master',    // Your MySQL database name
  port: 3306                        // Set port to 80 if MySQL is listening on port 80   
});

// Establish a connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL on port 3306 as id ' + db.threadId);
});

// Example route to fetch data
app.get('/data', (req, res) => {
  db.query('SELECT * FROM games', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

/*
app.delete('/data/:id', (req, res) => {
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
});*/


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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
