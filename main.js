// Here is an example of how to export a required function from another file:

// main.js - Accessible Insight Report Interface
// Line 13: Address accessibility issues from insight report — CONTINUING

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

// Main application logic
function main() {
  console.log('Application started');
}

// Accessibility helper function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(announcer);
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.removeEventListener('keydown', handleTabKey);
    }
  }

  document.addEventListener('keydown', handleTabKey);
  firstFocusable && firstFocusable.focus();
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
  
  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  }
}

// Handle missing alt text for images
function handleMissingAltText(container) {
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });
  
  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// Accessibility function to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || table.firstChild);
      }
    }
    table.querySelectorAll('td').forEach(td => {
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        td.setAttribute('scope', 'col');
      }
    });
  });
}

// Accessibility function to ensure proper main landmark
function addMainLandmark() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
  }
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    const titleId = `svg-title-${index}`;
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = titleId;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', title.id || titleId);
    }
  });
}

// Accessibility function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside, section[aria-label], section[aria-labelledby]');
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if ((tagName === 'header' || tagName === 'footer') && !landmark.closest('main')) {
      // Keep multiple headers/footers outside main
    } else if (landmark.querySelector('main') || landmark.closest('main')) {
      // Ensure main is not nested incorrectly
      const nestedMain = landmark.querySelector('main');
      if (nestedMain && !landmark.closest('section') && !landmark.closest('article')) {
        const parent = landmark.parentNode;
        if (parent) {
          parent.insertBefore(nestedMain, landmark.nextSibling);
        }
      }
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      if (onclick) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  const buttonsAsLinks = document.querySelectorAll('button[href], a[onclick]');
  buttonsAsLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      element.removeAttribute('href');
    }
  });
}

// Credential response handling for WebAuthn authentication
function handleCredentialResponse(credential, options = {}) {
  const {
    onSuccess,
    onError,
    expectedOrigin = window.location.origin,
    expectedRpId = window.location.hostname
  } = options;

  if (!credential || !credential.id || !credential.response) {
    const error = new Error('Invalid credential response: missing required fields');
    error.code = 'INVALID_CREDENTIAL';
    onError?.(error);
    return Promise.reject(error);
  }

  // Verify credential response structure
  const response = credential.response;
  const clientDataJSON = response.clientDataJSON;
  
  if (!clientDataJSON) {
    const error = new Error('Missing clientDataJSON in credential response');
    error.code = 'MISSING_CLIENT_DATA';
    onError?.(error);
    return Promise.reject(error);
  }

  let clientData;
  try {
    const decoded = new TextDecoder().decode(clientDataJSON);
    clientData = JSON.parse(decoded);
  } catch (e) {
    const error = new Error('Failed to parse clientDataJSON');
    error.code = 'PARSE_ERROR';
    onError?.(error);
    return Promise.reject(error);
  }

  // Validate origin
  if (clientData.origin !== expectedOrigin) {
    const error = new Error(`Origin mismatch: expected ${expectedOrigin}, got ${clientData.origin}`);
    error.code = 'ORIGIN_MISMATCH';
    onError?.(error);
    return Promise.reject(error);
  }

  // Validate challenge if provided
  if (options.challenge) {
    const expectedChallenge = arrayBufferToBase64Url(options.challenge);
    if (clientData.challenge !== expectedChallenge) {
      const error = new Error('Challenge mismatch');
      error.code = 'CHALLENGE_MISMATCH';
      onError?.(error);
      return Promise.reject(error);
    }
  }

  // Validate type
  if (options.type && clientData.type !== options.type) {
    const error = new Error(`Type mismatch: expected ${options.type}, got ${clientData.type}`);
    error.code = 'TYPE_MISMATCH';
    onError?.(error);
    return Promise.reject(error);
  }

  // For assertion responses, verify authenticatorData
  if (response.authenticatorData) {
    const authData = parseAuthenticatorData(response.authenticatorData);
    
    // Verify RP ID hash
    const expectedRpIdHash = hashRpId(expectedRpId);
    if (!compareBuffers(authData.rpIdHash, expectedRpIdHash)) {
      const error = new Error('RP ID hash mismatch');
      error.code = 'RP_ID_MISMATCH';
      onError?.(error);
      return Promise.reject(error);
    }

    // Check user presence and verification flags
    if (!(authData.flags & 0x01)) {
      const error = new Error('User presence not verified');
      error.code = 'USER_PRESENCE_FAILED';
      onError?.(error);
      return Promise.reject(error);
    }

    if (options.requireUserVerification && !(authData.flags & 0x04)) {
      const error = new Error('User verification required but not performed');
      error.code = 'USER_VERIFICATION_FAILED';
      onError?.(error);
      return Promise.reject(error);
    }
  }

  // For attestation responses, additional verification would be needed
  if (response.attestationObject) {
    // Attestation verification would go here
    console.log('Attestation response received, verification should be implemented server-side');
  }

  const result = {
    credentialId: credential.id,
    rawId: credential.rawId,
    type: credential.type,
    response: {
      clientDataJSON: response.clientDataJSON,
      authenticatorData: response.authenticatorData,
      signature: response.signature,
      userHandle: response.userHandle,
      attestationObject: response.attestationObject
    },
    clientData
  };

  onSuccess?.(result);
  return Promise.resolve(result);
}

// Helper function to convert ArrayBuffer to base64url
function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to parse authenticator data
function parseAuthenticatorData(buffer) {
  const dataView = new DataView(buffer);
  let offset = 0;
  
  const rpIdHash = buffer.slice(offset, offset + 32);
  offset += 32;
  
  const flags = dataView.getUint8(offset);
  offset += 1;
  
  const signCount = dataView.getUint32(offset, false);
  offset += 4;
  
  let attestedCredentialData = null;
  if (flags & 0x40) {
    // AT flag set - attested credential data present
    const aaguid = buffer.slice(offset, offset + 16);
    offset += 16;
    
    const credentialIdLength = dataView.getUint16(offset, false);
    offset += 2;
    
    const credentialId = buffer.slice(offset, offset + credentialIdLength);
    offset += credentialIdLength;
    
    // COSE public key would follow, but we'll stop here
    attestedCredentialData = { aaguid, credentialId };
  }
  
  let extensions = null;
  if (flags & 0x80) {
    // ED flag set - extensions present
    // CBOR parsing would be needed here
  }
  
  return { rpIdHash, flags, signCount, attestedCredentialData, extensions };
}

// Helper function to hash RP ID
function hashRpId(rpId) {
  const encoder = new TextEncoder();
  const data = encoder.encode(rpId);
  return crypto.subtle.digest('SHA-256', data);
}

// Helper function to compare buffers
function compareBuffers(buf1, buf2) {
  if (buf1.byteLength !== buf2.byteLength) return false;
  const view1 = new Uint8Array(buf1);
  const view2 = new Uint8Array(buf2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure all form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
    inputs.forEach((input, index) => {
      const id = input.id || `auto-input-${index}`;
      input.id = id;
      
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = `Input ${index + 1}`;
        label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        input.parentNode.insertBefore(label, input);
      }
    });

    // Ensure buttons are keyboard accessible
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('tabindex') && !button.hasAttribute('aria-label')) {
        // Button is accessible by default
      }
    });

    // Handle missing alt text for images
    handleMissingAltText(document.body);

    // Run origin/main accessibility improvements
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();

    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  });
}

// Export functions that might be required by other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    main,
    helperFunction,
    formatData,
    validateInput,
    announceToScreenReader,
    trapFocus,
    toggleAriaExpanded,
    handleMissingAltText,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    handleCredentialResponse,
    arrayBufferToBase64Url,
    parseAuthenticatorData,
    hashRpId,
    compareBuffers
  };
}