import React from 'react';

// Sample components demonstrating accessibility fixes

// REACT_015: React Language Attribute - Added lang attribute
// REACT_017: React Landmarks - Using semantic landmarks
// REACT_025: React Unique Landmarks - Each landmark is unique
// REACT_036: React Fake Link - Using proper <a> tags

import React from 'react';

// Accessibility Icon component
const AccessibleIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    aria-hidden="false"
    role="img"
  >
    <title>Settings gear icon</title>
    <desc>A gear icon representing the settings menu</desc>
    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49-1.01c.22.08.49 0 .61-.22l2-3.46c.13-.22.07-.49-.12-.64l-2.11-1.66z" />
  </svg>
);

// Navigation component with semantic HTML
const Navigation = () => (
  <nav role="navigation" aria-label="Main navigation">
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/about">About Us</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
);

// Accessible table component
const AccessibleTable = ({ data }) => (
  <table>
    <caption>User Information Table</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Main App Component
function App() {
  const userData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
  ];

  return (
    <div lang="en">
      <header role="banner">
        <h1>My Accessible Website</h1>
        <Navigation />
      </header>
      
      <main role="main" aria-labelledby="main-heading">
        <section aria-labelledby="users-section">
          <h2 id="users-section">Users</h2>
          <AccessibleTable data={userData} />
        </section>
        
        <section aria-labelledby="info-section">
          <h2 id="info-section">Information</h2>
          <p>This section contains important information about our services.</p>
          <a href="/more-info" className="button">Learn More</a>
        </section>
        
        <section aria-labelledby="icon-section">
          <h2 id="icon-section">Icons</h2>
          <AccessibleIcon size={48} />
        </section>
      </main>
      
      <footer role="contentinfo">
        <p>© 2024 My Accessible Website</p>
      </footer>
    </div>
  );
}

export default App;