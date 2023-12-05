// Import required modules
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const handlebars = require("handlebars");


// Connect and Create an Express Application
var app = express();
const port = 3000; // By default, its 3000, you can customize

// Create a Postgres Connection for Postgres database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'a', // Change to your password
  port: 5432, // Default Port
});

// Create a Postgres Connection for pok database
const pok = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pok',
  password: 'a', // Change to your password
  port: 5432, // Default Port
});

app.use(express.static(path.join('')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to read HTML file and compile it with handlebars
function render(filename, data) {
    var source = fs.readFileSync(filename, 'utf8').toString();
    var template = handlebars.compile(source);
    var output = template(data);
    return output;
}



/*

const query = "SELECT json_agg(notes) AS notes FROM notes;";
	pool.query(query, (error, results) => {
		if (error) {
			console.error('Error occurred:', error);
			//res.status(500).send('An error occurred while retrieving data from the postgres database.');
		} else {
			results = results.rows[0];
			var complete = render(path.join(__dirname, '', 'index.html'), results);
			console.log(complete);
			//res.json(notes);
		}
	});
	

*/




// Recieve a note from the user
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
            res.redirect('/notes');
        }
    });
});

// Recieve a new contact from the user
app.post('/add_person', function(req, res) {
    var fname = req.body.fname;
	var mname = req.body.mname;
    var lname = req.body.lname;
	var wemail = req.body.wemail;
	var pemail = req.body.pemail;
	var wphone = req.body.wphone;
	var pphone = req.body.pphone;
	var address = req.body.address;

    const query = 'INSERT INTO People(fname, mname, lname, wemail, pemail, wphone, pphone, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [fname, mname, lname, wemail, pemail, wphone, pphone, address];

    pok.query(query, values, (error, result) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).send('An error occurred while inserting data into the database.');
        } else {
            res.redirect('/contacts');
        }
    });
});

// Setup Route handler
app.get('/', (req, res) => {
	res.redirect('/notes');
});
app.get('/notes', (req, res) => {
	console.log("hello?");
	const query = "SELECT json_agg(notes) AS notes FROM notes;";
	pool.query(query, (error, result) => {
		if (error) {
			console.error('Error occurred:', error);
			//res.status(500).send('An error occurred while retrieving data from the postgres database.');
		} else {
			result = result.rows[0];
			result = render(path.join(__dirname, '', 'index.html'), result);
			res.send(result);
		}
	});
});


app.get('/login', (req, res) => {
  console.log("where do I see this text??");
});

/*
// Route handler for GET note data
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes ORDER BY note_id DESC;';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the postgres database.');
    } else {
      const notes = result.rows;
      res.json(notes);
    }
  });
});
*/

// Setup Route handler
app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'contacts.html'));
});

// Route handler for GET people data
app.get('/people', (req, res) => {
  const query = 'SELECT * FROM People ORDER BY id DESC;';

  pok.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the pok database.');
    } else {
      const people = result.rows;
      res.json(people);
    }
  });
});

// Listening to Requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

