tsx
import React from 'react';

const AppLayout: React.FC = ({ children }) => (
  <div>
    {/* existing code */}
    <main>{children}</main>
    {/* existing code */}
  </div>
);

export default AppLayout;