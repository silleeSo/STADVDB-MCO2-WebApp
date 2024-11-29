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
  database: 'test_db' // Your MySQL database name
});

// Check connection
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Fetch data from MySQL
app.get('/data', (req, res) => {
  db.query('SELECT * FROM my_table', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Delete data from MySQL
app.delete('/data/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM my_table WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Data deleted successfully' });
  });
});

// Add data to MYSQL
app.post('/add-record', (req, res) => {
  const data = req.body;

  const query = `
    INSERT INTO records (
      name, release_date, release_year, price, positive_reviews,
      negative_reviews, user_score, metacritic_score, avg_playtime_forever,
      avg_playtime_2weeks, median_playtime_forever
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
