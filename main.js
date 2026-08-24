import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <html lang="en">
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}