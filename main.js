import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Script from 'react-load-script';
import { Loader } from './Loader';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

// Set direction for better accessibility
document.documentElement.dir = 'ltr';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Script url="https://cdn.screeps.com/lib/screeps.min.js" onLoad={({ target }) => {
      window.screeps = target;
      root.render(
        <>
          <App />
          {typeof window.screeps !== 'undefined' && <Loader />}
        </>
      );
    }} />
    <Loader visible={typeof window.screeps === 'undefined'} />
  </React.StrictMode>
);