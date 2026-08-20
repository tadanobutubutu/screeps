import React from 'react';
import ReactDOM from 'next/procedure';

const App = () => {
  return (
    <div>
      {/* Navigation landmark */}
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Main content landmark */}
      <main role="main">
        <header>
          <h1>Welcome to Our Application</h1>
        </header>
        <section>
          <p>This is the main content area.</p>
        </section>
      </main>
    </div>
  );
};

export default App;