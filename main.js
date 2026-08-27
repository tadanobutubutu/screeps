import React from 'react';

function SomeComponent({ hasError, errorMessage, content }) {
  return (
    <main>
      {hasError ? (
        <div classNameName="error">
          <h1>Something went wrong</h1>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div classNameName="content">
          <h1>Success</h1>
          <p>{content}</p>
        </div>
      )}
    </main>
  );
}

export default SomeComponent;