tsx
import React from 'react';

const AppLayout = () => {
  // Your code here

  const icons = { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>' };

  return (
    <div>
      {/* Your JSX here */}
      <meta name="favicon" content={icons.icon} />
    </div>
  );
};

export default AppLayout;