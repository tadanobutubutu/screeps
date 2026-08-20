import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');

if (rootElement) {
  const container = ReactDOM.createRoot(rootElement);
  container.render(
    <main>
      <App />
    </main>
  );
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}