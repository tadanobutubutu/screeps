// Main.js - Application Entry Point

// Import required modules
const express = require('express');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Application state
const state = {
  initialized: false,
  config: null,
  data: []
};

// Configuration management
function loadConfiguration() {
  return {
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: parseInt(process.env.TIMEOUT) || 5000
  };
}

// Initialize application
function initialize() {
  if (state.initialized) {
    console.log('Application already initialized');
    return;
  }
  
  state.config = loadConfiguration();
  state.initialized = true;
  
  console.log(`Application initialized in ${state.config.environment} mode`);
}

// Core application logic
function processData(input) {
  if (!input) {
    throw new Error('Input is required');
  }
  
  const processed = {
    id: Date.now(),
    input: input,
    timestamp: new Date().toISOString(),
    status: 'processed'
  };
  
  state.data.push(processed);
  return processed;
}

// Query data
function getData(id) {
  if (id) {
    return state.data.find(item => item.id === id);
  }
  return state.data;
}

// Update data
function updateData(id, updates) {
  const index = state.data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  state.data[index] = {
    ...state.data[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return state.data[index];
}

// Delete data
function deleteData(id) {
  const index = state.data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }
  
  state.data.splice(index, 1);
  return true;
}

// TODO: Implement ...
// This TODO needs to be implemented based on the specific requirements
// Line 179 implementation goes here

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    initialized: state.initialized,
    environment: state.config?.environment || 'not configured'
  });
});

app.get('/api/data', (req, res) => {
  const { id } = req.query;
  res.json(getData(id ? parseInt(id) : undefined));
});

app.post('/api/data', (req, res) => {
  try {
    const { input } = req.body;
    const result = processData(input);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = updateData(parseInt(id), updates);
    
    if (!result) {
      return res.status(404).json({ error: 'Data not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteData(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ error: 'Data not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    healthy: true, 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
function startServer() {
  initialize();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${state.config.environment}`);
  });
}

// Export functions for testing
module.exports = {
  app,
  initialize,
  processData,
  getData,
  updateData,
  deleteData,
  loadConfiguration,
  startServer
};

// Start the server if running directly
if (require.main === module) {
  startServer();
}