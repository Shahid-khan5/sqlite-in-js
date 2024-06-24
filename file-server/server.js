// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors'); // Import cors middleware
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use(cors()); // Enable CORS for all routes
app.post('/save-database', (req, res) => {
  const dbPath = req.headers['x-db-path']; // Retrieve the full path from headers
  console.log(dbPath);
  const filePath =  dbPath; // Construct full file path
  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
        console.log(err);
      return res.status(500).send('Failed to save the database');
    }
    console.log('yes');
    res.send('Database saved successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
