// main.js
import React from 'react';

function App() {
  return (
    <div className="app">
      <Header />
      <main id="main-content">
        <h1>Welcome to our Application</h1>
        <p>This is the main content area of the application.</p>
        <nav aria-label="Primary navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header role="banner">
      <div className="logo">Logo</div>
      <nav aria-label="Header navigation">
        <a href="/settings">Settings</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer role="contentinfo">
      <p>&copy; 2024 Company Name</p>
      <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </nav>
    </footer>
  );
}

export default App;