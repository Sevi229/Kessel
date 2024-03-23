const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path to the main directory
const mainDir = path.join(__dirname, 'main');

// Serve the index.html file from the main directory
app.get('/', (req, res) => {
  res.sendFile(path.join(mainDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
