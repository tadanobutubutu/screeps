// Existing code in main.js
export function someFunction() {
  // Existing function implementation
}

export function anotherFunction() {
  // Another existing function implementation
}

// Changes requested in the issue
export function wrapContentWithMain() {
  return `
    <main>
      ${document.body.innerHTML}
    </main>
  `;
}

// Existing main.js content with conflict markers
/*
<<<<<<< HEAD
export function someFunction() {
  // Existing function implementation
}

export function anotherFunction() {
  // Another existing function implementation
}

// Changes requested in the issue
export function wrapContentWithMain() {
  return `
    <main>
      ${document.body.innerHTML}
    </main>
  `;
}

// ... rest of the code ...
*/