import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// REACT_015: Add lang attribute
document.documentElement.lang = 'en';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;
export { ReactDOM };