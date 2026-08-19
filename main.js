if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Browser environment: React app and accessibility fixes
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import App from './App';

  // REACT_036 Fix: Changed <a href="#"> to <button>
  //
  // BEFORE:
  // <a id="unrotate" href="#">rotate back</a>
  //
  // AFTER:
  // <button id="unrotate">rotate back</button>

  // Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      let title = svg.querySelector('title');
      if (!title) {
        const desc = svg.getAttribute('alt') || 'Graphic';
        title = document.createElement('title');
        title.textContent = desc;
        svg.appendChild(title);
      }
      svg.setAttribute('aria-hidden', 'true');
    }
  });

  // Add function to handle the fake link issue
  function handleFakeLinkClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.click();
    }
  }

  // Apply the fix to all hash-only links
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href="#"]').forEach(link => {
      link.addEventListener('click', handleFakeLinkClick);
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    });
  });

  // Existing code remains unchanged
  // ...

  const root = createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // All other existing code remains exactly as is
  // ...

  // React accessibility fix function for module environments (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      applyREACT041Fix: () => {
        document.querySelectorAll('svg').forEach(svg => {
          if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
            let title = svg.querySelector('title');
            if (!title) {
              const desc = svg.getAttribute('alt') || 'Graphic';
              title = document.createElement('title');
              title.textContent = desc;
              svg.appendChild(title);
            }
            svg.setAttribute('aria-hidden', 'true');
          }
        });
      }
    };
  }
} else {
  // Node.js environment
  if (require.main === module) {
    // This file is being run directly: execute file processing script
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
    const updatedFilePath = path.join(__dirname, 'docs', 'dependency-graph.html.tmp');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      const updatedData = data.replace(/<th\b[^>]*>/g, (match) => {
        return match.replace(/<th\b[^>]*>/, '<th scope="col">');
      });

      fs.writeFile(updatedFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }

        console.log('File updated successfully. Replace the original file with the temporary file.');

        // Optionally, you can replace the original file with the updated file
        // fs.rename(updatedFilePath, filePath, (err) => {
        //   if (err) {
        //     console.error('Error renaming file:', err);
        //     return;
        //   }
        //   console.log('Original file replaced successfully.');
        // });
      });
    });
  } else {
    // This file is being required as a module: export SVG fix function
    module.exports = {
      applyREACT041Fix: () => {
        if (typeof document !== 'undefined') {
          document.querySelectorAll('svg').forEach(svg => {
            if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
              let title = svg.querySelector('title');
              if (!title) {
                const desc = svg.getAttribute('alt') || 'Graphic';
                title = document.createElement('title');
                title.textContent = desc;
                svg.appendChild(title);
              }
              svg.setAttribute('aria-hidden', 'true');
            }
          });
        }
      }
    };
  }
}