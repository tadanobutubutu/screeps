// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

import React from 'react';

const MyComponent = ({ hasError, children }) => {
  if (hasError) {
    return (
      <section>
        <p>Error occurred</p>
      </section>
    );
  }

  return (
    <main>
      {children}
    </main>
  );
};

export default MyComponent;