import React from 'react';

export function MyComponent({ hasError }) {
  if (hasError) {
    return <section>Error content</section>;
  }
  return (
    <main>
      <h1>Success Content</h1>
    </main>
  );
}

// New function added
export function processData(data) {
  // Add your data processing logic here
}

export default MyComponent;