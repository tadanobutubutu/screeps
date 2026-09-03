// main.js

// Initialize app configuration
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// Utility function to format date
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Utility function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Process user data before sending to server
function processUserData(user) {
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    name: user.name ? user.name.trim() : '',
    email: user.email ? user.email.toLowerCase() : '',
    createdAt: user.createdAt || new Date().toISOString()
  };
}

// Function to handle API requests
async function makeRequest(endpoint, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, mergedOptions);
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Initiate credential flow
function initiateCredentialFlow(provider) {
  if (!provider) {
    throw new Error('Provider is required');
  }
  
  const flowUrl = `${config.apiUrl}/auth/${provider}/initiate`;
  return makeRequest(flowUrl, { method: 'POST' });
}

// Handle the credential response
function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No credential response received');
  }
  
  if (response.error) {
    const errorMessage = response.error_description || response.error;
    throw new Error(`Credential error: ${errorMessage}`);
  }
  
  if (!response.credential && !response.token) {
    throw new Error('Invalid credential response: missing credential or token');
  }
  
  const credentialData = {
    success: true,
    credential: response.credential || response.token,
    expiresAt: response.expires_at || null,
    refreshToken: response.refresh_token || null,
    tokenType: response.token_type || 'Bearer'
  };
  
  // Store credential in session storage if available
  if (typeof sessionStorage !== 'undefined' && credentialData.credential) {
    sessionStorage.setItem('auth_token', credentialData.credential);
  }
  
  return credentialData;
}

// Validate session and return user info
async function validateSession(token) {
  if (!token) {
    return null;
  }
  
  try {
    const response = await makeRequest('/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    return response.valid ? response.user : null;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
}

// Logout function to clear credentials
function logout() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
  }
  return { success: true };
}

// Export functions for testing and external use
module.exports = {
  config,
  formatDate,
  validateEmail,
  processUserData,
  makeRequest,
  initiateCredentialFlow,
  handleCredentialResponse,
  validateSession,
  logout
};