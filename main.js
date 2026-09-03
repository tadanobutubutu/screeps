// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 49e339d5ff675ce559aa9f4f66ff29aef3f6166b -->

function handleCredentialResponse(credential) {
    // Validate credential object exists
    if (!credential || !credential.response) {
        console.error('Invalid credential response received');
        return { success: false, error: 'Invalid credential response' };
    }

    const response = credential.response;

    // Handle attestation response (from registration)
    if (response.attestationObject) {
        const attestationBuffer = response.attestationObject;
        const attestationObj = Array.from(new Uint8Array(attestationBuffer));

        console.log('Credential registered successfully');
        console.log('Credential ID:', credential.id);

        return {
            success: true,
            type: 'registration',
            credentialId: credential.id,
            attestationObject: attestationObj
        };
    }

    // Handle assertion response (from authentication)
    if (response.authenticatorData) {
        const clientDataJSON = JSON.parse(new TextDecoder().decode(response.clientDataJSON));

        console.log('Credential verified successfully');
        console.log('Credential ID:', credential.id);
        console.log('Authentication timestamp:', new Date().toISOString());

        return {
            success: true,
            type: 'authentication',
            credentialId: credential.id,
            authenticatorData: response.authenticatorData,
            signature: response.signature,
            clientDataJSON: clientDataJSON
        };
    }

    return { success: false, error: 'Unknown credential response type' };
}

// Function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// TODO: Implement harvest logic
function harvest() {
    // Collect resources from elements with class 'resource'
    const resources = Array.from(document.querySelectorAll('.resource'))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0);
    return resources;
}

// This function is merged with the original implementation from both branches

// Function to initialize the application
function initializeApp() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        const button = createInPageButton('action-btn', 'Click Me', 'btn-primary');
        mainContent.appendChild(button);
    }
    validateLandmarkStructure();
}

// New functions and changes added from both branches

function function3(input) {
    if (typeof input === 'string') {
        return input.toUpperCase();
    }
    return input;
}

// Other functions merged from both branches

function getCurrentLanguageSetting() {
    // Assuming the language setting is stored in a cookie named 'language'
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('language='));
    if (cookie) {
        const [_, value] = cookie.split('=');
        return value;
    }
    // Default to English if no language setting is found
    return 'en';
}

function harvestResources() {
    // TODO: Implement the actual harvest logic
    console.log('Harvesting resources...');
    // Implement the actual logic here, e.g., fetching data, processing it, etc.
}

// Other functions merged from both branches

// Preserve any existing exports here
export { 
    createInPageButton, 
    validateLandmarkStructure, 
    harvest, 
    initializeApp, 
    function3, 
    getCurrentLanguageSetting, 
    harvestResources 
};