const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks
} = require('./utils');

const app = express();

app.use(axe.middleware());
app.use(express.static(path.join(__dirname, './data')));

async function initializeA11y() {
  const results = await axe.run('./public/index.html');
  const issues = results.violations.reverse();
  const output = [];

  issues.forEach((issue) => {
    const { description, suggestedFixes, nodes, rules } = issue;
    output.push(`🚨 Accessibility issue found: ${description}\n`);
    output.push(`  Rule: ${rules.name}\n`);
    output.push(`  Affected Nodes:\n`);

    nodes.forEach((node) => {
      output.push(`    ${node.nodeType}\n       ${node.nodeName}\n       ${node.htmlAttributeString}\n       ${node.content}\n\n`);
    });

    output.push(`  Suggested Fixes:\n`);
    suggestedFixes.forEach((fix) => {
      output.push(`    ${fix}\n\n`);
    });

    output.push('---------------------------------------------------\n');
  });

  return output.join('');
}

app.get('/a11y-report', async (req, res) => {
  const a11yReport = await initializeA11y();
  res.send(a11yReport);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  // ... call your init function to apply accessibility improvements
  // initializeAccessibilityFixes();
});