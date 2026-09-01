// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// Additional logic to handle credential response
function handleCredentialResponse(credentialResponse) {
  // Example processing of credential response
  // This is just a placeholder and should be replaced with actual logic
  if (credentialResponse && credentialResponse.credential) {
    // Assuming the credential object has a property called 'token'
    const token = credentialResponse.credential.token;
    console.log(`Received token: ${token}`);
    // Additional logic can be added here to handle the token or any other property
  } else {
    console.log('Invalid or missing credential response');
  }
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function handleCredentialResponse(credentialResponse) {
  return handleCredentialResponse(credentialResponse);
}