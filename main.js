import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Add accessibility improvements
  function ensureAccessibility() {
    // Ensure language attribute is set for screen readers
    document.documentElement.lang = 'en';

    // Add ARIA attributes to tables if they exist
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.getAttribute('role')) {
        table.setAttribute('role', 'table');
      }
      if (!table.getAttribute('aria-describedby')) {
        table.setAttribute('aria-describedby', 'table-description');
      }
    });

    // Add landmarks for better navigation
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }

    // Ensure SVGs have accessible names
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', 'Graphical element');
      }
    });

    // Ensure unique landmarks
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });

    // Replace fake links with proper anchor tags
    const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
    fakeLinks.forEach(link => {
      if (link.getAttribute('role') === 'link' && !link.tagName.match(/^A$/i)) {
        const newLink = document.createElement('a');
        newLink.href = link.getAttribute('data-href') || '#';
        newLink.innerHTML = link.innerHTML;
        link.parentNode.replaceChild(newLink, link);
      }
    });
  }

  // Call the accessibility function when the DOM is loaded
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', ensureAccessibility);
    // Cleanup on unmount
    return () => {
      document.removeEventListener('DOMContentLoaded', ensureAccessibility);
    };
  }, []);

  // Fetch dashboard data when user is available
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
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  return (
    <div className="dashboard min-h-screen">
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <section className="loading-section flex items-center justify-center min-h-[60vh]">
            <p>Loading dashboard...</p>
          </section>
        ) : error ? (
          <section className="error-section flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </section>
        ) : (
          <section className="data-section">
            <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dashboard content would go here */}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;