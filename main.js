// main.js - Main application entry point

const URL = require('url');
const queryString = require('querystring');

// Configuration
const config = {
    clientId: process.env.CLIENT_ID || '',
    redirectUri: process.env.REDIRECT_URI || '',
    authorizationEndpoint: process.env.AUTH_ENDPOINT || 'https://auth.example.com/authorize',
    tokenEndpoint: process.env.TOKEN_ENDPOINT || 'https://auth.example.com/token',
    scopes: ['openid', 'profile', 'email'],
    state: null
};

// State management for CSRF protection
function generateState() {
    const state = Math.random().toString(36).substring(2, 15);
    config.state = state;
    return state;
}

function validateState(receivedState) {
    if (!config.state) {
        return { valid: false, error: 'no_state_stored' };
    }
    if (receivedState !== config.state) {
        return { valid: false, error: 'state_mismatch' };
    }
    return { valid: true };
}

// Build authorization URL
function buildAuthorizationUrl() {
    const state = generateState();
    const params = new URL.URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        state: state
    });
    return `${config.authorizationEndpoint}?${params.toString()}`;
}

// Credential response handling
/**
 * Handles the credential response from the authorization server callback.
 * Parses URL parameters or fragment and returns a structured response object.
 * 
 * @param {Object} response - The response object containing query/fragment parameters
 * @param {string} [response.error] - Error code if authorization failed
 * @param {string} [response.error_description] - Human-readable error description
 * @param {string} [response.code] - Authorization code (for code flow)
 * @param {string} [response.access_token] - Access token (for implicit flow)
 * @param {string} [response.id_token] - ID token (for OpenID Connect)
 * @param {string} [response.state] - State parameter for CSRF validation
 * @param {number} [response.expires_in] - Token expiration time in seconds
 * @returns {Object} Structured credential response
 */
function handleCredentialResponse(response) {
    // Validate response object exists
    if (!response || typeof response !== 'object') {
        return {
            success: false,
            error: 'invalid_response',
            errorDescription: 'Response must be a valid object'
        };
    }

    // Handle error responses
    if (response.error) {
        const errorResult = {
            success: false,
            error: response.error,
            errorDescription: response.error_description || null,
            errorUri: response.error_uri || null
        };

        // Validate state even on error
        if (response.state) {
            const stateValidation = validateState(response.state);
            errorResult.stateValid = stateValidation.valid;
            if (!stateValidation.valid) {
                errorResult.stateError = stateValidation.error;
            }
        }

        return errorResult;
    }

    // Validate state parameter (CSRF protection)
    if (response.state) {
        const stateValidation = validateState(response.state);
        if (!stateValidation.valid) {
            return {
                success: false,
                error: 'state_mismatch',
                errorDescription: 'State parameter validation failed',
                details: stateValidation.error
            };
        }
    } else {
        // State should be present for security
        return {
            success: false,
            error: 'missing_state',
            errorDescription: 'State parameter is required for security'
        };
    }

    // Handle authorization code response (Authorization Code Flow)
    if (response.code) {
        return {
            success: true,
            type: 'authorization_code',
            code: response.code,
            state: response.state,
            timestamp: new Date().toISOString()
        };
    }

    // Handle implicit flow response (token in URL fragment)
    if (response.access_token) {
        const tokenResponse = {
            success: true,
            type: 'implicit',
            accessToken: response.access_token,
            tokenType: response.token_type || 'Bearer',
            expiresIn: response.expires_in || null,
            scope: response.scope ? response.scope.split(' ') : config.scopes,
            state: response.state,
            timestamp: new Date().toISOString()
        };

        // Include ID token if present (OIDC)
        if (response.id_token) {
            tokenResponse.idToken = response.id_token;
        }

        return tokenResponse;
    }

    // Handle ID token response (hybrid flow)
    if (response.id_token && !response.access_token) {
        return {
            success: true,
            type: 'id_token',
            idToken: response.id_token,
            state: response.state,
            timestamp: new Date().toISOString()
        };
    }

    // No recognized credential data found
    return {
        success: false,
        error: 'invalid_response',
        errorDescription: 'No valid credential data found in response'
    };
}

/**
 * Parse credential response from URL query parameters
 * @param {string} urlString - The full callback URL
 * @returns {Object} Parsed response object
 */
function parseCallbackUrl(urlString) {
    try {
        const url = new URL.URL(urlString);
        const response = {};
        
        // Parse query parameters
        url.searchParams.forEach((value, key) => {
            response[key] = value;
        });
        
        // Parse fragment parameters if present
        if (url.hash && url.hash.length > 1) {
            const fragmentParams = queryString.parse(url.hash.substring(1));
            Object.assign(response, fragmentParams);
        }
        
        return response;
    } catch (error) {
        return { error: 'invalid_url', error_description: error.message };
    }
}

// Export functions
module.exports = {
    config,
    buildAuthorizationUrl,
    handleCredentialResponse,
    parseCallbackUrl,
    validateState,
    generateState
};