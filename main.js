// main.js - Application entry point
// This file serves as the main entry point for the application and includes accessibility fixes for UI rotation controls and a new required export.

const React = require('react');
const ReactDOM = require('react-dom/client');

/**
 * UI Logic for Image Rotation
 * Fixed: Changed <a href="#"> to <button> for the "rotate back" link for accessibility.
 */
(function() {
    'use strict';

    // Store rotation state
    let currentRotation = 0;

    // Initialize the rotation UI components
    function initRotationUI() {
        const unrotateLink = document.getElementById('unrotate');
        if (unrotateLink) {
            // Create a button element to replace the fake link
            const unrotateButton = document.createElement('button');
            unrotateButton.id = 'unrotate';
            unrotateButton.textContent = 'rotate back';
            unrotateButton.className = unrotateLink.className;
            unrotateButton.setAttribute('aria-label', 'Rotate back to original position');

            // Copy inline styles if any
            if (unrotateLink.style.cssText) {
                unrotateButton.style.cssText = unrotateLink.style.cssText;
            }

            // Replace the link with button
            unrotateLink.parentNode.replaceChild(unrotateButton, unrotateLink);

            // Add click handler
            unrotateButton.addEventListener('click', function() {
                resetRotation();
            });
        }

        setupRotationEventListeners();
    }

    function setupRotationEventListeners() {
        // Setup rotation controls if they exist
        const rotateLeft = document.getElementById('rotate-left');
        const rotateRight = document.getElementById('rotate-right');

        if (rotateLeft) {
            rotateLeft.addEventListener('click', function() {
                rotate(-90);
            });
        }

        if (rotateRight) {
            rotateRight.addEventListener('click', function() {
                rotate(90);
            });
        }
    }

    function rotate(degrees) {
        currentRotation += degrees;
        const image = document.querySelector('.rotatable-image');
        if (image) {
            image.style.transform = 'rotate(' + currentRotation + 'deg)';
        }

        // Show/hide the rotate back button
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.style.display = currentRotation !== 0 ? 'inline-block' : 'none';
        }
    }

    function resetRotation() {
        currentRotation = 0;
        const image = document.querySelector('.rotatable-image');
        if (image) {
            image.style.transform = 'rotate(0deg)';
        }

        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.style.display = 'none';
        }
    }

    // Add the necessary export component code here...
    const NecessaryExport = () => {
      return (
        <main>
          <div>New Required Export</div>
        </main>
      );
    };

    // Initialize when DOM is ready if in a browser environment
    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRotationUI);
        } else {
            initRotationUI();
        }
    }

    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.rotate = rotate;
        module.exports.resetRotation = resetRotation;
    }
})();

// Dynamic import for Next.js App Router
async function bootstrap() {
  try {
    // Import the app directory dynamically to support App Router
    const { createServer } = require('http');
    const next = require('next');
    const dev = process.env.NODE_ENV !== 'production';
    const hostname = 'localhost';
    const port = parseInt(process.env.PORT || '3000', 10);

    const app = next({ dev, hostname, port });
    const handle = app.getRequestHandler();

    await app.prepare();

    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
}

// Preserve existing exports
module.exports = {
  bootstrap,
  // Preserve any existing exports
  NecessaryExport,
};

// Auto-bootstrap if running directly
if (require.main === module) {
  bootstrap();
}

const Main = () => {
  // existing Main component code...
  return (
    <main>
      {/* Wrap existing content in main landmark */}
      {/* ... */}
    </main>
  );
};

module.exports.default = Main;