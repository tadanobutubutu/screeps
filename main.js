import React from 'react'
import ReactDOM from 'react-dom/client'

// Import the Dashboard component
import Dashboard from './components/Dashboard'

// Create root and render Dashboard wrapped in a single <main> element
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <main>
    <Dashboard />
  </main>
)