const { app, BrowserWindow } = require('electron');
const path = require('path');
const { parseArgs } = require('util');

// Global reference to mainWindow to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// New function to address accessibility issues
function validateAccessibility() {
  // Add code to validate accessibility based on the insight report
}

// Export functions for testing
module.exports = {
  createWindow,
  parseArgs,
  app,
  validateAccessibility, // Added function
};