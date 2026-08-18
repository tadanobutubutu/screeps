// main.js (unchanged - no conflicts or issues found)
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'docs' directory
app.use(express.static(path.join(__dirname, 'docs')));

// Route for the dependency graph
app.get('/dependency-graph', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'dependency-graph.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});