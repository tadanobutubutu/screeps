import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

// Accessibility components (from HEAD)
const HtmlWithLang = ({ children }) => (
  <html lang="en">
    {children}
  </html>
);

const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <th scope="row">{row.header}</th>
          <td>{row.cell1}</td>
          <td>{row.cell2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AccessibleIcon = ({ label }) => (
  <svg role="img" aria-label={label} width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

const AccessibleIconWithTitle = ({ label }) => (
  <svg role="img" aria-labelledby="icon-title" width="24" height="24" viewBox="0 0 24 24">
    <title id="icon-title">{label}</title>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

const MainContent = ({ children }) => (
  <main id="main-content" role="main">
    {children}
  </main>
);

const Navigation = ({ links }) => (
  <nav aria-label="Main navigation">
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const SiteFooter = () => (
  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </footer>
);

const ActionButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

const RealLink = ({ href, children }) => (
  <a href={href}>
    {children}
  </a>
);

// New component for fake link replacement
const RotateBackButton = ({ onClick }) => (
  <button
    id="unrotate"
    type="button"
    onClick={onClick}
    aria-label="Rotate back"
  >
    rotate back
  </button>
);

// Main App Component
const App = () => {
  const tableData = [
    { header: 'Row 1', cell1: 'Data 1', cell2: 'Data 2' },
    { header: 'Row 2', cell1: 'Data 3', cell2: 'Data 4' },
  ];

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleRotateBack = () => {
    console.log('Rotate back action triggered');
    // Add your rotation logic here
  };

  return (
    <HtmlWithLang>
      <head>
        <title>Accessible Application</title>
      </head>
      <body>
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <header role="banner">
          <nav aria-label="Site header">
            <AccessibleIcon label="Website Logo" />
            <Navigation links={navLinks} />
          </nav>
        </header>

        <MainContent>
          <h1>Accessible Content</h1>
          <AccessibleTable data={tableData} />
          <ActionButton onClick={() => console.log('clicked')}>
            Click Me
          </ActionButton>
          <RotateBackButton onClick={handleRotateBack} />
        </MainContent>

        <SiteFooter />
      </body>
    </HtmlWithLang>
  );
};

// Dashboard component (from origin/main)
const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getDashboardData(user.id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardContent data={data!} />
    </div>
  );
};

// Export all components
export {
  App,
  AccessibleTable,
  AccessibleIcon,
  AccessibleIconWithTitle,
  MainContent,
  Navigation,
  SiteFooter,
  ActionButton,
  RealLink,
  HtmlWithLang,
  Dashboard,
  RotateBackButton, // Added new export
};

export default App;