var loop = require('main/loop');
var roles = require('main/roles');

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// Add landmark roles and fix landmark issues
roles.addLandmarkRoles();

// Add accessible names to 2 SVGs
roles.addAccessibleNamesToSVGs();

// Ensure unique landmarks (2 issues)
roles.ensureUniqueLandmarks();

// Fix 1 fake link issue
roles.fixFakeLinkIssue();

// No need to add scope="col" or scope="row" to <th> elements since it's already implemented

module.exports = loop;