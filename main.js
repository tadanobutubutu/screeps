`

// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const unrotateButton = document.getElementById('unrotate');
    
    if (unrotateButton) {
        unrotateButton.addEventListener('click', function() {
            // Reset rotation
            const content = document.querySelector('.rotated-content');
            if (content) {
                content.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Other existing functionality
});

import { useState } from 'react';
import Link from 'next/link';

export default function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rotation, setRotation] = useState(45);

  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Menu icon</title>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        <section aria-labelledby="table-heading">
          <h1 id="table-heading">Data Table</h1>

          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Value</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr key={i}>
                  <td>Item {i}</td>
                  <td>{i * 10}</td>
                  <td>{i % 2 === 0 ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="section2-heading">
          <h2 id="section2-heading">Section 2</h2>
          <p>Content here</p>
        </section>

        <section aria-labelledby="unrotate-heading">
          <h2 id="unrotate-heading">Rotated Content</h2>
          <div 
            className="rotated-content" 
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            This content is rotated.
          </div>
          <button 
            id="unrotate"
            onClick={() => setRotation(0)}
          >
            Unrotate
          </button>
        </section>
      </main>

      <aside role="complementary" aria-label="Sidebar navigation">
        <button
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <title>Sidebar toggle icon</title>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {sidebarOpen && (
          <nav aria-label="Sidebar navigation">
            <ul>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/settings">Settings</Link></li>
            </ul>
          </nav>
        )}

        <div className="info">
          <span>Sidebar</span>
          <button
            aria-label="Go to home"
            onClick={() => {}}
          >
            Go home
          </button>
        </div>
      </aside>

      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
}