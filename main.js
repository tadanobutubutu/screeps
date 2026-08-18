import React from 'react';

const MyComponent = ({ hasError, errorMessage, successData }) => {
  return (
    <main>
      {hasError ? (
        <section>
          <p>Error: {errorMessage}</p>
        </section>
      ) : (
        <article>
          <h1>Success</h1>
          <p>{successData}</p>
        </article>
      )}
    </main>
  );
};

export default MyComponent;