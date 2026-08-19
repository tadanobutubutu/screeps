// For React update to v19
// Update package.json to:
// "react": "^19.0.0",
// "react-dom": "^19.0.0"

// For Jest update to v30
// Update package.json to:
// "jest": "^30.0.0",
// "babel-jest": "^30.0.0"

// For ESLint update to v10
// Update package.json to:
// "eslint": "^10.0.0"

// For TypeScript update to v7
// Update package.json to:
// "typescript": "^7.0.0"

// REACT_017 fix: Wrapped primary content in <main> landmark for screen reader accessibility
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main role="main">
      <App />
    </main>
  </React.StrictMode>
)