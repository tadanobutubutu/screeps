// main.js
import React from 'react';

const MainComponent = ({ isError, content }) => {
  // Single main element wrapping all content
  return (
    <main aria-label="Main content area">
      {isError ? (
        // Replace secondary <main> with <section> for error state
        <section aria-labelledby="error-heading" role="alert">
          <h2 id="error-heading">Error</h2>
          <p>{content}</p>
        </section>
      ) : (
        // Replace secondary <main> with <article> for success state
        <article aria-labelledby="success-heading">
          <h2 id="success-heading">Success</h2>
          <p>{content}</p>
        </article>
      )}
    </main>
  );
};

export default MainComponent;