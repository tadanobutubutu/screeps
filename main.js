import React from 'react';

function MyComponent({ hasError, errorMessage, successData }) {
  if (hasError) {
    return (
      <section>
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </section>
    );
  }

  return (
    <main>
      <h1>Success</h1>
      <p>{successData}</p>
    </main>
  );
}

export default MyComponent;