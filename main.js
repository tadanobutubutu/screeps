import React from 'react'
import ReactDOM from 'react-dom/client'

// Main application component with accessibility improvements
const App = () => {
  return (
    <div id="root" lang="en">
      <header role="banner">
        <h1>Accessible Application</h1>
      </header>
      
      <main role="main">
        <section>
          <p>Welcome to the accessible demo.</p>
          
          {/* Accessible table with proper structure */}
          <table role="grid">
            <thead>
              <tr>
                <th scope="col">Column 1</th>
                <th scope="col">Column 2</th>
                <th scope="col">Column 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-testid="item-1">First Item</td>
                <td data-testid="item-2">Second Item</td>
                <td data-testid="item-3">Third Item</td>
              </tr>
              <tr>
                <td data-testid="item-4">Fourth Item</td>
                <td data-testid="item-5">Fifth Item</td>
                <td data-testid="item-6">Sixth Item</td>
              </tr>
            </tbody>
          </table>
          
          {/* Accessible SVG with descriptive label */}
          <svg aria-label="Core workflow diagram showing three stages" role="img">
            <rect x="10" y="20" width="80" height="60" fill="#4A90D9" rx="5"/>
            <line x1="30" y1="40" x2="70" y2="40" stroke="#333" strokeWidth="2"/>
            <text x="45" y="48" fontSize="12" fill="#333">Stage 1 → Stage 2 → Stage 3</text>
          </svg>
          
          {/* Button with explicit language attribute */}
          <button 
            lang="en"
            onClick={() => console.log('Action triggered')}
          >
            Execute
          </button>
        </section>
      </main>
    </div>
  )
}

export default App