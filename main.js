import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { someUtility } from './utils';

// Existing component logic
function Header() {
  const handleRotateBack = () => {
    // Existing in‑page action (no navigation)
  };

  return (
    <header>
      <h1>My App</h1>

      {/* Other existing links */}
      <a href="#/">Home</a>

      {/* Fixed: use a button instead of a fake link */}
      <button type="button" onClick={handleRotateBack}>
        rotate back
      </button>
    </header>
  );
}

// Preserve existing prop‑types
Header.propTypes = {
  handleRotateBack: PropTypes.func.isRequired,
};

// Preserve existing exports
export default connect()(Header);

// Other existing named exports (if any)
export const utils = {
  foo: 'bar',
};