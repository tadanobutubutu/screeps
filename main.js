// main.js - React Component Example

import React from 'react';

const MyComponent = ({ data, error }) => {
  // Return single <main> with conditional content inside
  return (
    <main>
      {error ? (
        <section className="error-state" role="alert">
          <h1>Error</h1>
          <p>{error.message}</p>
        </section>
      ) : data ? (
        <article>
          <h1>Success</h1>
          <p>{data.content}</p>
        </article>
      ) : (
        <section className="loading-state">
          <p>Loading...</p>
        </section>
      )}
    </main>
  );
};

export default MyComponent;