const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Handles credential extraction from API responses
 */
function handleCredentialResponse(response) {
  const credentials = {};

  if (response && typeof response === 'object') {
    // Extract authorization token from response headers
    if (response.headers && response.headers['authorization']) {
      credentials.token = response.headers['authorization'];
    }

    // Extract credentials from response body if present
    if (response && typeof response === 'object' && 'body' in response) {
      const body = response.body;
      if (typeof body === 'object' && body !== null) {
        if (body.credentials) {
          Object.assign(credentials, body.credentials);
        }
      }
    }
  }

  return credentials;
}

// Example route demonstrating credential handling
app.get('/protected', (req, res) => {
  // Simulate getting a response with credentials
  const mockResponse = {
    status: 200,
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    body: { message: 'Hello' }
  };

  const creds = handleCredentialResponse(mockResponse);
  console.log('Extracted credentials:', creds);

  res.json({ success: true, data: 'Protected resource' });
});

// Middleware to apply credential handling
app.use((req, res, next) => {
  // Process response to extract credentials
  const response = req.responses || [];
  if (response.length > 0) {
    const lastResponse = response[response.length - 1];
    const extracted = handleCredentialResponse(lastResponse);
    // Store credentials for potential reuse
    req.extractedCredentials = extracted;
  }
  next();
});

module.exports = app;