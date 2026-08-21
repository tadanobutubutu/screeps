import { render } from 'react';
import { App } from './components/App';

const rootElement = document.getElementById('root');
if (rootElement) {
  render(
    <App />,
    rootElement,
    // Adding aria-label to the rootElement to ensure the App component is announced properly by screen readers
    { ariaLabel: 'Main Application' }
  );
}