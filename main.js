// main.js

// Existing code (do not modify or remove)
// ...

// Import the Dashboard component (do not modify or remove)
import Dashboard from './components/Dashboard';

// Function to render the Dashboard component
function renderDashboard() {
  // Existing rendering logic (do not modify or remove)
  // ...

  // Check if the component is in an error state or success state
  if (errorState) {
    // Render the error state <main> element
    return (
      <main>
        {/* Error state content */}
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          {/* ... other error state elements ... */}
        </div>
      </main>
    );
  } else if (successState) {
    // Render the success state <main> element
    return (
      <main>
        {/* Success state content */}
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          {/* ... other success state elements ... */}
        </div>
      </main>
    );
  }

  // Render the default <main> element if no error or success state
  return (
    <main>
      {/* Default content */}
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* ... default content elements ... */}
      </div>
    </main>
  );
}

// Render the Dashboard component on the page
function renderPage() {
  // Existing rendering logic (do not modify or remove)
  // ...

  // Render the Dashboard component with conditional <main> elements
  renderDashboard();
}

// Initial render call
renderPage();

// Existing event listeners and other logic (do not modify or remove)
// ...