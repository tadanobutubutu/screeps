// app/layout.tsx
import React from 'react';

export default function Layout() {
  return (
    <div className="App">
      {/* Other components */}
      <svg src="/favicon.svg" aria-hidden="true" />
    </div>
  );
}

// dashboard/app/layout.tsx
import React from 'react';

export default function DashboardLayout() {
  return (
    <div className="DashboardLayout">
      {/* Other components */}
      <svg src="/favicon.svg" aria-hidden="true" />
    </div>
  );
}