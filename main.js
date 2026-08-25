// pages/main.js
import { useState } from 'react';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for table
  const tableData = [
    { id: 1, name: 'Item 1', category: 'Category A' },
    { id: 2, name: 'Item 2', category: 'Category B' },
    { id: 3, name: 'Item 3', category: 'Category A' },
  ];

  // Navigation links - using proper anchor elements
  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div lang="en">
      {/* REACT_015: Added lang attribute */}
      
      {/* REACT_017 & REACT_025: Proper landmark structure with unique IDs */}
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                {/* REACT_036: Using actual anchor tag instead of div */}
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* REACT_025: Only one main landmark */}
      <main role="main" id="main-content">
        <h1>Welcome to Our Site</h1>

        {/* REACT_027: Proper table structure */}
        <table>
          <caption>Items List</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <p>Content goes here</p>
        </div>
      </main>

      {/* REACT_017 & REACT_025: Footer landmark */}
      <footer role="contentinfo">
        <p>&copy; 2024 Company Name</p>
        
        {/* REACT_041: SVG with accessible name */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="social-title social-desc"
          role="img"
        >
          <title id="social-title">Social Media Icon</title>
          <desc id="social-desc">Icon linking to our social media profiles</desc>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2"/>
        </svg>
        
        {/* Alternative SVG with aria-label */}
        <a href="https://twitter.com" aria-label="Follow us on Twitter">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
          </svg>
        </a>
      </footer>

      {/* Pagination using proper links */}
      <nav role="navigation" aria-label="Pagination">
        <ul>
          <li>
            <a 
              href={`?page=${currentPage - 1}`}
              aria-label="Previous page"
              aria-disabled={currentPage === 1}
            >
              Previous
            </a>
          </li>
          <li>
            <a 
              href={`?page=${currentPage + 1}`}
              aria-label="Next page"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}