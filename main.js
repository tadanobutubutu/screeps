// main.js

// Find the primary content element in the DOM
const primaryContent = document.querySelector('main') ||
                        document.querySelector('[role="main"]') ||
                        document.querySelector('article') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
    // Create a new <main> element
    const mainElement = document.createElement('main');

    // Insert the <main> element before the primary content in the DOM
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);

    // Move the primary content inside the <main> element
    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

// Function to address insight issues
function addressInsightIssues(form) {
  if (!form) return;

  // Ensure form has proper accessibility attributes
  if (!form.getAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  // Get all input fields in the form
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    // Ensure each input has an aria-label or associated label
    const id = input.id || input.getAttribute('name');
    const label = document.querySelector(`label[for="${id}"]`);
    if (id && !label) {
      input.setAttribute('aria-label', input.name || 'Form input');
    }

    // Ensure required fields have proper ARIA attributes
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }
  });

  // Get the submit button
  const submitButton = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
  if (submitButton && submitButton.hasAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

// Function to add landmark regions
function addLandmarkRegions(container) {
  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  return regions.map(role => {
    let existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      existing = document.createElement('div');
      existing.setAttribute('role', role);
      existing.setAttribute('aria-label', role);
      container.appendChild(existing);
    }
    return existing;
  });
}

// New function
function newFunction() {
  console.log('New function executed');
}

// Function to initialize Google Sign-In
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

// Helper function to load and process landmarks
function loadAndProcessLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const landmarks = JSON.parse(data);
    return processLandmarks(landmarks);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
  }
}

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Exports
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

module.exports = {
  wrapPrimaryContentInMain,
  newFunction,
  googleSignIn,
  loadAndProcessLandmarks,
  isValidLandmark
};