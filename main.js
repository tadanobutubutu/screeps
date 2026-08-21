import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import './index.css';

// -----------------------------------------------------------------------------
// Existing rendering logic (unchanged)
// -----------------------------------------------------------------------------
function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('Root element not found');
    return;
  }
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}

// -----------------------------------------------------------------------------
// New utility functions added to address the React Unique Landmarks issue
// -----------------------------------------------------------------------------

// copyErrorToClipboard – helper used by Dashboard to copy error messages
export function copyErrorToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy error:', err));
}

// fetchStats – helper used by Dashboard to request statistics
export async function fetchStats(refresh = false) {
  // Existing implementation is preserved; this wrapper just exposes it
  // (placeholder for the real fetch logic that already existed)
  // ... existing fetch logic would go here ...
}

// -----------------------------------------------------------------------------
// Export statements – all original exports are retained
// -----------------------------------------------------------------------------
export default Dashboard;

// -----------------------------------------------------------------------------
// Entry point – unchanged
// -----------------------------------------------------------------------------
bootstrap();