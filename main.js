import React from 'react';

function DashboardComponent() {
  return (
    <div>
      <main>
        {/* Content for main section */}
        <p>Main content of the page.</p>
      </main>
      <main>
        {/* This is the conflicting second <main> */}
        <p>Another main content that should be restructured.</p>
      </main>
    </div>
  );
}

export default DashboardComponent;