// main.js - Fixed version addressing REACT_025
// Single <main> element with conditional rendering inside

export function SomeComponent({ hasError, children }) {
  // FIX: Use a single <main> element and render conditional content inside
  // instead of having multiple <main> elements in different return paths
  
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {hasError ? (
        <div className="error-state">
          <h1>Error</h1>
          <p>An error has occurred.</p>
        </div>
      ) : (
        <div className="success-state">
          <h1>Success</h1>
          {children}
        </div>
      )}
    </main>
  );
}

// Alternative fix: Move <main> outside the conditional returns
export function AnotherComponent({ status, data, error }) {
  // Always render a single <main> landmark
  const renderContent = () => {
    if (status === 'loading') {
      return <p>Loading...</p>;
    }
    
    if (status === 'error') {
      return (
        <article aria-labelledby="error-title">
          <h1 id="error-title">Error</h1>
          <p>{error.message}</p>
        </article>
      );
    }
    
    return (
      <article aria-labelledby="content-title">
        <h1 id="content-title">{data.title}</h1>
        <p>{data.description}</p>
      </article>
    );
  };
  
  return (
    <main>
      {renderContent()}
    </main>
  );
}

// If the component is nested inside a parent <main>, consider using 
// <section> or <article> for subsections instead of additional <main> elements
export function NestedComponent({ content }) {
  return (
    <section aria-labelledby="nested-section-title">
      <h2 id="nested-section-title">Section Title</h2>
      {content}
    </section>
  );
}

// Image rotation component
export function ImageRotator({ onRotate }) {
  // ... existing code for rotation logic ...
  
  return (
    <div className="image-rotator">
      {/* Image display logic */}
      
      {/* FIX: Changed from <a href="#"> to <button> for proper accessibility */}
      <button id="unrotate" onClick={onRotate}>
        rotate back
      </button>
    </div>
  );
}

// Main application component
export default function App() {
  return (
    <div>
      <ImageRotator onRotate={() => {}} />
    </div>
  );
}