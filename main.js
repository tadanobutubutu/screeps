// main.js - Accessibility fixes applied and interactive image rotation logic

// Fix 1: Add lang attribute to html element
// This should be in your _document.js or html file:
// <html lang="en">

// Fix 6: Replace fake links with real anchor elements
// BAD: <div onClick={handleClick}>Click here</div>
// GOOD: <a href="/destination" onClick={handleClick}>Click here</a>
// OR if it's not a navigation: <button onClick={handleClick}>Click here</button>

export const FakeLink = ({ onClick, children }) => (
  // Fixed: Using proper button element instead of fake link
  <button 
    type="button" 
    onClick={onClick}
    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}
  >
    {children}
  </button>
);

// Fix 4: Add accessible names to SVG elements
export const Icon = ({ name, size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    aria-label={name} // Fixed: Added aria-label for screen readers
    role="img"
  >
    <use href={`#icon-${name}`} />
  </svg>
);

// Fix 4: Alternative with aria-labelledby reference
export const DecorativeIcon = ({ titleId }) => (
  <svg 
    width="24" 
    height="24" 
    aria-labelledby={titleId} // Fixed: Links to title element
    role="img"
  >
    <title id={titleId}>Icon description</title>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Fix 2 & Fix 3: Proper table structure with landmarks
export const DataTable = ({ headers, rows }) => (
  <main> {/* Fix 3: Proper main landmark */}
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th> // Fixed: Added scope
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </main>
);

// Fix 3: Proper landmark structure
export const PageLayout = ({ children }) => (
  <>
    <header> {/* Fix 3: Header landmark */}
      <nav aria-label="Main navigation"> {/* Fix 3: Nav with label for uniqueness */}
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    
    <main id="main-content"> {/* Fix 3: Main landmark */}
      {children}
    </main>
    
    <footer> {/* Fix 3: Footer landmark */}
      <p>Copyright 2024</p>
    </footer>
  </>
);

// Fix 5: Unique landmark example with aria-labels for disambiguation
export const NavigationMenus = () => (
  <>
    <nav aria-label="Primary navigation">
      {/* Primary nav content */}
    </nav>
    
    <nav aria-label="Secondary navigation">
      {/* Secondary nav content */}
    </nav>
    
    <nav aria-label="Footer navigation">
      {/* Footer nav content */}
    </nav>
  </>
);

// Utility function to generate proper table headers
export const TableHeader = ({ children }) => (
  <th scope="col">{children}</th>
);

// Utility function for table cells in header row
export const TableHeadCell = ({ children }) => (
  <th scope="col">{children}</th>
);

// Utility function for table cells in body
export const TableBodyCell = ({ children }) => (
  <td>{children}</td>
);

// Accessible SVG with title and description
export const AccessibleSVG = ({ title, description, children }) => (
  <svg 
    role="img"
    aria-labelledby="svg-title svg-desc"
  >
    <title id="svg-title">{title}</title>
    <desc id="svg-desc">{description}</desc>
    {children}
  </svg>
);

// Export all utilities
export default {
  FakeLink,
  Icon,
  DecorativeIcon,
  DataTable,
  PageLayout,
  NavigationMenus,
  TableHeader,
  TableHeadCell,
  TableBodyCell,
  AccessibleSVG,
};

// ---------------------------------------------------
// Image rotation logic (kept from the other branch)

// Main application logic
(function() {
  'use strict';

  // Image rotation state
  let currentRotation = 0;
  const image = document.getElementById('target-image');

  /**
   * Rotates the image by the specified degrees
   * @param {number} degrees - The number of degrees to rotate
   */
  function rotateImage(degrees) {
    currentRotation += degrees;
    if (image) {
      image.style.transform = `rotate(${currentRotation}deg)`;
    }
  }

  /**
   * Resets the image rotation to 0 degrees
   */
  function resetRotation() {
    currentRotation = 0;
    if (image) {
      image.style.transform = 'rotate(0deg)';
    }
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    const rotateButton = document.getElementById('rotate');
    const unrotateButton = document.getElementById('unrotate');

    if (rotateButton) {
      rotateButton.addEventListener('click', function() {
        rotateImage(90);
      });
    }

    if (unrotateButton) {
      unrotateButton.addEventListener('click', function() {
        resetRotation();
      });
    }
  });

  // Export functions for testing (if in a Node environment)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      rotateImage,
      resetRotation
    };
  }
})();

=========================================