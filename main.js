tsx
import React from 'react';

const AppLayout: React.FC = ({ children }) => {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard Apple Icon"><title>Screeps Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  };

  return (
    <main>
      <div>
        {/* Assuming some other components here */}
        {children}
        {/* Example of using the icons */}
        <img src={icons.icon} alt="Screeps Dashboard Icon" />
        <img src={icons.apple} alt="Screeps Apple Icon" />
      </div>
    </main>
  );
};

export default AppLayout;