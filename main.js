'use strict';

/* Helper to safely fetch a package version from package.json or return an empty string */
function _fetchPackageVersion(pkg, depName = pkg) {
    try {
        const pkgPath = require.resolve(`${depName}/package.json`);
        const { version } = require(pkgPath);
        return typeof version === 'string' ? version : '';
    } catch (e) {
        // Package not found or unparsable: return empty string
        return '';
    }