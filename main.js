import React from 'react';
import ReactDOM from 'react-dom/client';

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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

export default App;