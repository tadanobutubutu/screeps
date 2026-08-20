var loop = function() {
    // Your main game loop code here
};

function createRotateBackButton(container) {
    // Remove existing element if it exists
    var existing = document.getElementById('unrotate');
    if (existing) {
        existing.remove();
    }
    
    // Create button instead of anchor
    var button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = 'rotate back';
    
    // Add click handler for rotation reset
    button.addEventListener('click', function() {
        // Reset rotation logic here
        if (typeof resetViewRotation === 'function') {
            resetViewRotation();
        }
    });
    
    if (container) {
        container.appendChild(button);
    }
    
    return button;
}

function initUI() {
    var uiContainer = document.getElementById('ui');
    if (uiContainer) {
        createRotateBackButton(uiContainer);
    }
}

// Export for Screeps
module.exports = loop;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}