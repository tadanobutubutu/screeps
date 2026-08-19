tsx
import React from 'react';

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

export default DashboardLayout;