const main = require('./main');

const { addLangAttribute, fixTableStructure, fixLandmarkIssues, addProperLandmarkRegions } = require('./accessibilityHelperFunctions');

(async () => {
  await main();

  document.addEventListener('DOMContentLoaded', () => {
    // Add lang attribute to HTML element
    addLangAttribute(document);

    // Fix table structure issues
    fixTableStructure(document);

    // Fix landmark issues
    fixLandmarkIssues(document);

    // Add proper landmark regions
    addProperLandmarkRegions(document);
  });
})();