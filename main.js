const tableHeaders = [
  {
    label: 'src/constants.js',
    value: 'Constants',
    scope: 'col'
  },
  {
    label: 'src/managers/roomManager.js',
    value: 'Room Manager',
    scope: 'col'
  },
  // ... other headers with scope: 'col' added
];

// New function to ensure unique landmarks are used for accessibility
function ensureUniqueLandmarks(headers) {
  const landmarks = new Set();
  headers.forEach(header => {
    if (landmarks.has(header.label)) {
      console.warn(`Duplicate landmark found: ${header.label}`);
    } else {
      landmarks.add(header.label);
    }
  });
}

// Call the function with the tableHeaders array
ensureUniqueLandmarks(tableHeaders);

// The rest of the main.js content would remain unchanged.