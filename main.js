// main.js

import React from 'react';

/**
 * Sample component demonstrating the fix for REACT_025 React Unique Landmarks issue.
 * Original issue: Multiple <main> landmarks in mutually exclusive returns (error/success states)
 * Fix: Keep only one <main> landmark and use <article> for other regions
 */

// FIXED VERSION - Only one <main> landmark
const FixedComponent = ({ data, isLoading, error }) => {
  // Early return for loading state - use section, not main
  if (isLoading) {
    return (
      <section className="loading-container">
        <p>Loading...</p>
      </section>
    );
  }

  // Error state - use article instead of main to avoid duplicate landmarks
  if (error) {
    return (
      <article className="error-container" role="alert">
        <h2>Error</h2>
        <p>{error.message}</p>
      </article>
    );
  }

  // Success state - use main for the primary landmark
  return (
    <main className="content-container">
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </main>
  );
};

// Alternative fix: Wrap both states in a single <main> element
const AlternativeFixedComponent = ({ data, isLoading, error }) => {
  return (
    <main className="main-container">
      {isLoading && (
        <section className="loading-container">
          <p>Loading...</p>
        </section>
      )}
      
      {error && (
        <article className="error-container" role="alert">
          <h2>Error</h2>
          <p>{error.message}</p>
        </article>
      )}
      
      {!isLoading && !error && data && (
        <article className="content-container">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </article>
      )}
    </main>
  );
};

export { FixedComponent, AlternativeFixedComponent };