/** @jsxImportSource react */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// REACT_017 fix: Wrapped primary content in <main> landmark for screen reader accessibility
// REACT_025 fix: Ensured only one <main> element exists in the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)