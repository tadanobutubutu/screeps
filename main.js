import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Store } from './store';
import App from './app/app';

// ...existing code remains unchanged ...

const rootElement = document.getElementById('root');
const store = Store();
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

export default () => rootElement;