import React from 'react';

const MyComponent = ({ content }) => {
  return (
    <div>
      <main>
        {/* Assuming 'content' is the JSX for the primary content */}
        {content}
      </main>
    </div>
  );
};

export default MyComponent;