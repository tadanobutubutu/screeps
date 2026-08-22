// main.js - Fixed REACT_025: Only one <main> landmark allowed per page

export function Component({ hasError, children, errorContent }) {
  // Return error state with section instead of main
  if (hasError) {
    return (
      <div className="error-container">
        <section aria-labelledby="error-heading">
          <h1 id="error-heading">Error</h1>
          {errorContent}
        </section>
      </div>
    );
  }

  // Return success state with the single main landmark
  return (
    <div className="success-container">
      <main aria-labelledby="main-heading">
        <h1 id="main-heading">Content</h1>
        {children}
      </main>
    </div>
  );
}

export default Component;