// main.js - Fixed accessibility issue: Only ONE main landmark per page
import { useState, useEffect } from 'react';

export default function MainPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data on mount
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation items */}
        </nav>
      </header>
      
      {/* Only ONE main landmark - fixes REACT_025 */}
      <main role="main" id="main-content">
        <h1>Welcome to the Main Page</h1>
        
        {loading ? (
          <div role="status" aria-live="polite" aria-busy="true">
            Loading content...
          </div>
        ) : (
          <section aria-labelledby="data-heading">
            <h2 id="data-heading">Content Section</h2>
            {data && <p>{JSON.stringify(data)}</p>}
          </section>
        )}
      </main>
      
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </>
  );
}