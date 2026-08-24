import React from 'react';
import ReactDOM from 'react-dom';

// ... existing code ...

const App = () => (
  <div id='app' data-testid="app" lang="en">
    {/* your existing code */}
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

export default App;