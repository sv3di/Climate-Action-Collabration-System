const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Add this line to parse JSON data

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create an SQLite database in memory
const db = new sqlite3.Database(':memory:');

// Create a table for the projects
db.serialize(() => {
  db.run('CREATE TABLE projects (title TEXT, description TEXT, type TEXT, location TEXT, objective TEXT, startDate TEXT, endDate TEXT)');
});

// Serve static files from the 'public' directory
app.use(express.static("/Users/alsaadi/Desktop/Climate Action Collabration System"));


// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'initiate.html'));
});

// Handle project initiation
app.post('/initiateProject', (req, res) => {
  const projectData = req.body;

  console.log('Received project data:', projectData);

  // Insert project data into SQLite database
  db.run('INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?)', [
    projectData.title,
    projectData.description,
    projectData.type,
    projectData.location,
    projectData.objective,
    projectData.start,
    projectData.end,
  ], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true, message: 'Project initiated successfully!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
