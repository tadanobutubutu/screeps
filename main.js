tsx
import React from 'react';
import Header from './Header';

const Layout: React.FC = ({ children }) => (
  <body>
    <Header />
    <main>{children}</main>
  </body>
);

export default Layout;