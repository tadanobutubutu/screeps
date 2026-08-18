import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col items-left bg-gray-50 p-4 fixed w-full h-20 z-10">
        {/* navbar */}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;