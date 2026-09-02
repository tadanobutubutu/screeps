const app = express();
const http = require('http');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: false,
  version: '1.0.0',
  port: process.env.PORT || 3000
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const fixAccessibility = require('./accessibility');
const countDependencies = require('./dependencies');

app.get('/api/fixAccessibility', (req, res) => {
  const fixResult = fixAccessibility({ document: req.query.html });
  res.json(fixResult);
});

app.get('/api/countDependencies', (req, res) => {
  const count = countDependencies(__dirname);
  res.json({ count });
});

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});