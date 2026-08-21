import React from 'react'
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(document.getElementById('root'))

if (typeof window !== 'undefined') {
  document.documentElement.lang = 'en'
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)