tsx
import React from "react";
// ... (existing imports)

const AppLayout = () => {
  // ... (existing code)
  return (
    <div className="font-default flex font-sans flex-col h-screen overflow-y-auto bg-gray-100 text-gray-600 antialiased">
      {/* ... (existing components) */}
      <header className="flex w-full items-center justify-between border-b border-gray-200 p-4 bg-white shadow-sm">
        {/* ... (existing code) */}
        <div className="flex items-center justify-center space-x-1">
          <Icon icon={icons.icon} aria-label="Screeps Dashboard" />
        </div>
      </header>
      {/* ... (existing components) */}
    </div>
  );
};

export default AppLayout;