tsx
import React from 'react';
// ... (existing imports)

const MyLayout = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};

export default MyLayout;