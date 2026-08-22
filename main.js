tsx
import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
  <body>
    <main>{children}</main>
    {/* Add a comment here to indicate the placement of the second main element */}
    {/* <main>Second Main Element (if necessary)</main> */}
  </body>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;