// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeIcon from './icons/home.svg';
import UserIcon from './icons/user.svg';
import './styles.css';

// Existing utility function – keep unchanged
function formatData(data) {
  return data.map(item => `${item.id}: ${item.name}`);
}

/* Resolve merge‑conflict markers (HEAD vs. feature branch) */
import { ReactComponent as HomeIcon } from './icons/home.svg';
import { ReactComponent as UserIcon } from './icons/user.svg';

/* The rest of the original file – preserve all exports and functions */
function App() {
  return (
    <div role="document" aria-label="Main application">
      <header>
        <h1>Welcome to the App</h1>
      </header>
      <main>
        <section aria-labelledby="hero-heading">
          <h2 id="hero-heading">Hero Section</h2>
          {/* Accessible SVG icons */}
          <HomeIcon aria-label="Home icon" role="img" />
          <UserIcon aria-label="User profile icon" role="img" />
        </section>
      </main>
      <footer>
        <p>&copy; 2025 My Company</p>
      </footer>
    </div>
  );
}

/* Preserve any named exports that existed before */
export { formatData };

export default App;