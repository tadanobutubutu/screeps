import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
  <body>
    <main>{children}</main>
  </body>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;