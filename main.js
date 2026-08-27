Here is the resolved `main.js` file that integrates both changes:

```javascript
import React from 'react';
import MyComponent from './MyComponent';

function SomeComponent({ hasError, errorMessage, content }) {
  const rotateBack = () => {
    // Logic to rotate back
  };

  return (
    <main>
      <div id="unrotate">
        <button onClick={rotateBack}>rotate back</button>
      </div>
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

SomeComponent.defaultProps = {
  hasError: false,
  errorMessage: '',
  content: '',
};

export default SomeComponent;

// ... existing code ...
```

The HTML button was changed to a React button, and the `rotateBack` function was added to make it functional. I have not written any logic for the `rotateBack` function since it was not provided in the example you provided.