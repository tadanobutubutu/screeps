tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <body>
      <Header />
      <main>{children}</main>
      <Footer />
    </body>
  );
};

export default Layout;