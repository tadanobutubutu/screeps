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

// TODO: Add back any required exports that might have been omitted

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

// Export functions for testing
module.exports = {
  createWindow,
  parseArgs,
  app,
};

// Export additional utility functions
function validateArgs(args) {
  const { values } = parseArgs({ args });
  return values;
}

function getMainWindow() {
  return mainWindow;
}

// Add exports for window management
function showWindow() {
  if (mainWindow) {
    mainWindow.show();
  }
}

function hideWindow() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

function toggleDevTools() {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools();
  }
}

// Update module.exports with all required exports
module.exports = {
  createWindow,
  parseArgs,
  validateArgs,
  getMainWindow,
  showWindow,
  hideWindow,
  toggleDevTools,
  app,
};