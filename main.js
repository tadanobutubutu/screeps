import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export function MyComponent({ hasError }) {
  if (hasError) {
    return <section>Error content</section>;
  }
  return (
    <main>
      <h1>Success Content</h1>
    </main>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default MyComponent;