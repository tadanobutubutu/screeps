import React from 'react';

const MyComponent = ({ hasError, errorData, successData }) => {
  // Fix: Use a single <main> and conditionally render content inside
  // rather than having separate <main> elements in different branches
  
  return (
    <main>
      {hasError ? (
        <section aria-live="polite">
          <h1>Error</h1>
          <p>{errorData?.message || 'An error occurred'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </section>
      ) : (
        <article>
          <h1>Success</h1>
          <p>{successData?.message || 'Operation completed successfully'}</p>
          {successData?.items && (
            <ul>
              {successData.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </article>
      )}
    </main>
  );
};

export default MyComponent;