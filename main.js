import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add aria-label or title element to make SVG accessible */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" aria-label="Website icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

const Dashboard = ({ error, data }) => {
  if (error) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="error-section">
            <h2>Error</h2>
            <p>{error.message}</p>
          </section>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="loading-section">
            <h2>Loading...</h2>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>
        <section className="data-section">
          <h2>Data Overview</h2>
          {/* Render your data here */}
        </section>
      </main>
    </div>
  );
};

export { Dashboard };