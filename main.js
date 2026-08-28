// main.js
// Application entry point

const { app, BrowserWindow } = require('electron');
const path = require('path');

// Global reference to prevent garbage collection
let mainWindow;

// Initialize configuration
function initializeConfig() {
    const configPath = path.join(__dirname, 'config.json');
    const fs = require('fs');
    
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Failed to load config:', error.message);
        return { debug: false, port: 3000 };
    }
}

// Create the main application window
function createWindow() {
    const config = initializeConfig();
    
    mainWindow = new BrowserWindow({
        width: config.windowWidth || 1200,
        height: config.windowHeight || 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // TODO: Add implementation details
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (config.debug) {
        mainWindow.webContents.openDevTools();
    }
}

// Application ready handler
function onAppReady() {
    createWindow();
    console.log('Application started successfully');
}

// Event listeners
app.whenReady().then(onAppReady);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Export for testing
module.exports = {
    initializeConfig,
    createWindow,
    onAppReady
};