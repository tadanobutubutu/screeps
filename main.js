// Add this line at the start of the file
const { userAgent } = require('user-agent');

const isWebBrowser = userAgent().isWebBrowser;
if (isWebBrowser) {
  const fs = require('fs');
  const content = fs.readFileSync('./main.js', 'utf8');
  // Fix the fake link issue in the content:
  const fixedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');
  const updatedHTML = `<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
${fixedContent}
</body>
</html>`;
  process.stdout.write(updatedHTML);
} else {
  // Keep your existing code here
}

// Existing functions and exports follow here
import React from 'react';

const MyTableComponent = () => {
  const updatedHTML = `
    <table lang="en">
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
          <th scope="col">Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
          <td>Data 3</td>
        </tr>
      </tbody>
    `;

  // Fix the fake link issue:
  updatedHTML = updatedHTML.replace(
    /<a id="unrotate" href="#">rotate back<\/a>/,
    '<button id="unrotate">rotate back</button>'
  );

  return updatedHTML;
};

export { MyTableComponent };

// Let's fix the fake link issue in the App component as well:
const updatedHTML = rootElement.outerHTML.replace(
  /<a id="unrotate" href="#">rotate back<\/a>/,
  '<button id="unrotate">rotate back</button>'
);
rootElement.innerHTML = updatedHTML;

export default function App() {
  // Your existing App component...
}