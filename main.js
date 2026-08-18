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

// Additional function to handle table headers with proper scope attributes
const TableHeader: React.FC<{ children: React.ReactNode; scope: 'col' | 'row' }> = ({ children, scope }) => {
  return (
    <th scope={scope}>
      <div>{children}</div>
    </th>
  );
};

// Helper function to generate table headers with proper scope
const generateTableHeaders = (headers: string[], scope: 'col' | 'row' = 'col') => {
  return headers.map((header, index) => (
    <TableHeader key={index} scope={scope}>
      {header}
    </TableHeader>
  ));
};

export { TableHeader, generateTableHeaders };