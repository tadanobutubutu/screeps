// index.js

import React from 'react';

// ... (existing imports) ...

function Form() {
  return (
    <form>
      <label htmlFor="name">Name:</label>
      <input id="name" aria-label="Name input" name="name" />

      {/* Additional fields and labels... */}

      <button type="submit" aria-label="Submit form">Submit</button>
    </form>
  );
}

// ... (export the updated Form) ...