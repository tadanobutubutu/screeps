// Fixed layout icon definitions for REACT_041 — added aria-hidden="true" to decorative SVGs

export const dashboardLayout = {
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  },
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Replaces a fake anchor link (<a href="#">) with a proper button.
 * @param {string} filePath - Path to the file to fix.
 */
function fixFakeLink(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Replace <a id="unrotate" href="#">...</a> with <button id="unrotate" type="button">...</button>
    const newContent = content.replace(
      /id="unrotate"\s+href="#"/g,
      '<button id="unrotate" type="button">rotate back</button>'
    );
    fs.writeFileSync(filePath, newContent);
  } catch (err) {
    console.error(`Failed to fix ${filePath}:`, err.message);
  }
}

// Apply the fix to the documented file
const docsGraphPath = path.join(__dirname, 'docs', 'dependency-graph.html');
if (fs.existsSync(docsGraphPath)) {
  fixFakeLink(docsGraphPath);
}

export const appLayout = {
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  },
};