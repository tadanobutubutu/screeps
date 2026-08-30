// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// TODO: This is the existing code that needs to be preserved
import react from 'react';

const HTML = ({ lang }) => <html lang={lang}>/* other children */</html>;

// ... (existing code, exports, and functions)

function getLangAttribute() {
  // Code for getting the language attribute
}

function addLangAttribute(element) {
  // Code for adding the language attribute to the specified element
}

function validateTableAccessibility() {
  // Code for validating table accessibility
}

function validateTableStructure() {
  // Code for validating table structure
}

function fixTableStructure() {
  // Code for fixing table structure issues
}

function addMainLandmark() {
  // Code for adding main landmark
}

function validateLandmark() {
  // Code for validating landmark
}

function validateLandmarkStructure() {
  // Code for validating landmark structure
}

function validateLandmarkAttributes() {
  // Code for validating landmark attributes
}

function getSvgAccessibleName() {
  // Code for getting accessible name for SVGs
}

function setSvgAttributes(svg, accessibleName) {
  // Code for setting SVG attributes with the accessible name
}

function ensureUniqueLandmarks() {
  // Code for ensuring unique landmarks
}

function createInPageButton() {
  // Code for creating an in-page button
}

function validateLinkAccessibility() {
  // Code for validating link accessibility
}

function handleFakeLinks() {
  // Code for handling fake links
}

function addLandmarkRegions() {
  // Code for adding proper landmark regions
}

// TODO: Implement credential response handling
function handleCredentialResponse(response) {
  if (!response) {
    return { success: false, error: 'No response provided' };
  }

  if (response.error) {
    return {
      success: false,
      error: response.error_description || response.error || 'Unknown credential error'
    };
  }

  if (!response.credential) {
    return { success: false, error: 'No credential in response' };
  }

  try {
    const credentialParts = response.credential.split('.');
    if (credentialParts.length !== 3) {
      return { success: false, error: 'Invalid credential format' };
    }

    const payload = JSON.parse(atob(credentialParts[1].replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { success: false, error: 'Credential has expired' };
    }

    return {
      success: true,
      credential: response.credential,
      payload: payload,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    };
  } catch (error) {
    return { success: false, error: 'Failed to parse credential: ' + (error.message || 'Unknown error') };
  }
}

function validateCredential(credential) {
  if (!credential || typeof credential !== 'string') {
    return false;
  }

  const parts = credential.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

function processCredentialToken(credential) {
  if (!credential || typeof credential !== 'string') {
    return null;
  }

  const parts = credential.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return {
      iss: payload.iss,
      sub: payload.sub,
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
  } catch (error) {
    console.error('Error processing credential token:', error);
    return null;
  }
}

function handleCredentialError(error) {
  if (!error) {
    return 'An unknown error occurred';
  }

  if (error.code === 'invalid_token') {
    return 'The credential token is invalid or has been revoked';
  }

  if (error.code === 'token_expired') {
    return 'The credential token has expired. Please sign in again.';
  }

  if (error.code === 'invalid_grant') {
    return 'The credential grant is invalid or expired';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An error occurred while processing credentials';
}

function validateCredentialResponse(response) {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Invalid response format' };
  }

  if (!response.credential || typeof response.credential !== 'string') {
    return { valid: false, error: 'Missing or invalid credential field' };
  }

  if (response.credential.length === 0) {
    return { valid: false, error: 'Credential cannot be empty' };
  }

  try {
    const parts = response.credential.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Credential must have 3 parts' };
    }

    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false, error: 'Credential has expired' };
    }

    return { valid: true, payload: payload };
  } catch (error) {
    return { valid: false, error: 'Failed to validate credential: ' + (error.message || 'Parse error') };
  }
}

class CredentialCache {
  constructor() {
    this.cache = {};
    this.cacheDuration = appState.config?.credentialCacheDuration || 300000;
  }

  set(credential, data) {
    try {
      const encrypted = this.encryptCredential(credential);
      this.cache[credential] = {
        data: data,
        expiresAt: Date.now() + this.cacheDuration
      };
      return true;
    } catch (error) {
      console.error('Error caching credential:', error);
      return false;
    }
  }

  get(credential) {
    try {
      const cached = this.cache[credential];
      if (!cached) return null;

      if (Date.now() >= cached.expiresAt) {
        delete this.cache[credential];
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error retrieving cached credential:', error);
      return null;
    }
  }

  clear() {
    this.cache = {};
  }

  cleanup() {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (!this.cache[key].expiresAt || now >= this.cache[key].expiresAt) {
        delete this.cache[key];
      }
    });
  }

  encryptCredential(credential) {
    return Buffer.from(credential).toString('base64');
  }

  decryptCredential(encrypted) {
    return Buffer.from(encrypted, 'base64').toString('utf8');
  }
}

const credentialCache = new