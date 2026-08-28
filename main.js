import React from 'react';
import ReactDOM from 'react-dom/client';

// React component
function App() {
  return (
    <div lang="en">
      <header className="header">
        <div className="logo">MyApp</div>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main role="main">
        <h1>Welcome</h1>
        <p>This is the main content area.</p>
        <section aria-labelledby="section-title">
          <h2 id="section-title">Important Information</h2>
          <p>Additional content here.</p>
        </section>
      </main>
      <footer role="contentinfo">
        <nav aria-label="Footer navigation">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><button type="button" onClick={() => alert('Email us!')}>Email Us</button></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

// Existing utility function
export function anotherFunction() {
  // More existing functionality
}

// Screeps loop logic
function loop() {
  // Resolve merged bot logic for Screeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }
}

// Export for Screeps (CommonJS) and for ES modules
if (typeof module !== 'undefined' && module.exports) {
  // Node/Screeps environment
  module.exports.loop = loop;
} else {
  // ES module environment
  export { loop };
}

// Render UI in browser
if (typeof window !== 'undefined') {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

// Default export for other usages
export default App;