import React from 'react';

// ... existing imports and your code

function App() {
  // ... existing function content

  // Ensure only one <main> element exists at any given time by managing state
  const [errorState, setErrorState] = React.useState(false);
  const [successState, setSuccessState] = React.useState(false);

  const renderContent = () => {
    if (errorState) {
      return (
        <main>
          {/* Error content */}
          <p>Some error occurred</p>
        </main>
      );
    } else if (successState) {
      return (
        <main>
          {/* Success content */}
          <p>Operation was successful</p>
        </main>
      );
    }

    // Default content that does not need to be wrapped in <main>
    return (
      // ... rest of your code
    );
  };

  return (
    <div className="App">
      <img src={favicon} alt="Favicon" />
      {renderContent()}
    </div>
  );
}

export default App;