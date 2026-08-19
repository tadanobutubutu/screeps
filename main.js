tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function Layout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);