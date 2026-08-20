import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Resolve merge conflict: use the version that adds the <main> wrapper
const root = ReactDOM.createRoot(document.getElementById('root'));

function RootWithMain() {
  return (
    <main>
      {/* Primary content rendered by the application */}
      <App />
    </main>
  );
}

root.render(<RootWithMain />);
export default RootWithMain;