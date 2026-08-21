import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactComponent as HomeIcon } from './icons/home.svg';
import { ReactComponent as UserIcon } from './icons/user.svg';
import { ReactComponent as NewIcon } from './new_icon.svg'; // Added for the new icon
import './styles.css';

function formatData(data) {
  return data.map(item => `${item.id}: ${item.name}`);
}

function App() {
  return (
    <div role="document" aria-label="Main application">
      <header>
        <h1>Welcome to the App</h1>
      </header>
      <main>
        <section aria-labelledby="hero-heading">
          <h2 id="hero-heading">Hero Section</h2>
          <HomeIcon aria-label="Home icon" role="img" />
          <UserIcon aria-label="User profile icon" role="img" />
          <NewIcon aria-label="New icon" role="img" /> // Added for the new icon
        </section>
      </main>
      <footer>
        <p>&copy; 2025 My Company</p>
      </footer>
    </div>
  );
}

export { formatData };
export default App;