// main.js - Fixed to have a single <main> landmark

import React, { useState } from 'react';

function ExampleComponent() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Single main landmark wrapping conditional content
  return (
    <main role="main">
      {hasError ? (
        <section aria-labelledby="error-heading">
          <h1 id="error-heading">Error</h1>
          <p>Something went wrong. Please try again.</p>
          <button onClick={() => setHasError(false)}>Retry</button>
        </section>
      ) : (
        <article aria-labelledby="content-heading">
          <h1 id="content-heading">Success</h1>
          {data && <p>{data.message}</p>}
          <button onClick={() => setData({ message: 'Updated!' })}>Update</button>
        </article>
      )}
    </main>
  );
}

export default ExampleComponent;