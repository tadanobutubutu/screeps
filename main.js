import React from 'react';
import PropTypes from 'prop-types';

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Implementing harvest and upgrade logic
let resourceCount = 0;

const harvest = () => {
  resourceCount += 1;
  console.log(`Harvested! Total resources: ${resourceCount}`);
};

const upgrade = () => {
  if (resourceCount >= 10) {
    resourceCount -= 10; // Spend resources for upgrade
    console.log('Upgraded! Resources spent for upgrade.');
  } else {
    console.log('Not enough resources to upgrade.');
  }
};

// Adding the missing required exports
export { Main, PropTypes, harvest, upgrade };
export default Main;