// Main application entry point

const express = require('express');
const { initializeLogger, logInfo, logError } = require('./utils/logger');
const { loadConfiguration } = require('./config');
const { validateInput, processData } = require('./services/dataProcessor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main data processing endpoint
app.post('/process', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!validateInput(data)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    
    const result = await processData(data);
    logInfo('Data processed successfully');
    
    res.json({ success: true, result });
  } catch (error) {
    logError(`Processing error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logError(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Something went wrong' });
});

// Application initialization
async function initialize() {
  try {
    initializeLogger();
    await loadConfiguration();
    logInfo('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initialize();
  
  app.listen(PORT, () => {
    logInfo(`Server running on port ${PORT}`);
    console.log(`Application started: http://localhost:${PORT}`);
  });
}

// Export for testing
module.exports = {
  app,
  initialize,
  startServer
};

// Run if executed directly
if (require.main === module) {
  startServer();
}