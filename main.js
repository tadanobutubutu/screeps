// role.healer.js

// ... other code ...

const myHealthFunction = (...params) => {
  // ... other code ...

  if (health < 100) {
    // Below line caused the Parsing error
    // Replace the usage of "===" with a regular "=" operator if appropriate
    health = (health * healerBoost) + healthRegeneration;

    // ... other code ...
  }

  // ... other code ...
};

// ... other exports ...