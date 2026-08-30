// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

import React from 'react';
import ReactDOM from 'react-dom/client';

// Add lang attribute to HTML element
document.documentElement.lang = 'en';

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>My App</h1>
      </header>
      <main role="main">
        <p>Welcome to my app.</p>
        <button aria-label="Submit">Submit</button>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);