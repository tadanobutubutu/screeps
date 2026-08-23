import React from 'react';

function Header() {
  return (
    <header role="banner" aria-label="Site Header">
      <div ...
        <h1>My Website</h1>
      </div>
    </header>
  );
}

function Navigation() {
  return (
    <nav role="navigation" aria-label="Main Navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a ...
        <li><a ...
      </ul>
    </nav>
  );
}

function MainContent() {
  return (
    <main role="main" aria-label="Primary Content">
      <h2>Welcome to the main content area</h2>
      <p>This is the primary content of the page.</p>
    </main>
  );
}

function Sidebar() {
  return (
    <aside role="complementary" aria-label="Sidebar">
      <h3>Sidebar</h3>
      <p>Additional information and links.</p>
    </aside>
  );
}

function Footer() {
  return (
    <footer role="contentinfo" aria-label="Site Footer">
      <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
  );
}

function Logo() {
  return (
    <svg
      role="img"
      aria-label="Company Logo"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="40" fill="#4A90E2" />
      <text x="50" y="55" textAnchor="middle" fill="white" ...
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      role="img"
      aria-label="Search Icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function UniqueSection() {
  return (
    <section id="unique-section" role="region" aria-label="Featured Section">
      <h3 id="unique-heading">Featured Section</h3>
      <p>This is a unique section with its own landmark.</p>
    </section>
  );
}

function FakeLinkFixed() {
  return (
    <a href="/real-page">Real Link</a>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Navigation />
      <MainContent />
      <Sidebar />
      <Footer />
      <Logo />
      <SearchIcon />
      <UniqueSection />
      <FakeLinkFixed />
    </>
  );
}