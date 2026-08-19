/** @jsxImportSource react */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// REACT_017 fix: Wrapped primary content in <main> landmark for screen reader accessibility
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main role="main">
      <App />
    </main>
  </React.StrictMode>
)