// Import required modules
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');

// Connect and Create an Express Application
var app = express();
const port = 3000; // By default, its 3000, you can customize

// Create a Postgres Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'a', // Change to your password
  port: 5432, // Default Port
});

app.use(express.static(path.join('')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send_note', function(req, res) {
    var title = req.body.ntitle;
    var body = req.body.nbody;

    const query = 'INSERT INTO notes(title, body) VALUES($1, $2)';
    const values = [title, body];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).send('An error occurred while inserting data into the database.');
        } else {
            res.redirect('/');
        }
    });
});


// Setup Route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Route handler for GET student data
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes ORDER BY note_id DESC;';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const students = result.rows;
      res.json(students);
    }
  });
});

// Listening to Requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

