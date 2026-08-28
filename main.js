// Current main.js
const fs = require('fs');
const path = require('path');

// Configuration for the application
const config = {
  svgDirectory: './assets/svg',
  outputDirectory: './dist',
};

// TODO: Implement this function for setting accessible names to SVGs
function setAccessibleNames() {
  const svgFiles = fs.readdirSync(config.svgDirectory).filter(file => file.endsWith('.svg'));
  
  svgFiles.forEach(file => {
    const filePath = path.join(config.svgDirectory, file);
    let svgContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the filename without extension to use as a base name
    const baseName = path.basename(file, '.svg');
    
    // Check if SVG already has a title element
    const hasTitle = /<title[\s\S]*?>[\s\S]*?<\/title>/i.test(svgContent);
    const hasAriaLabel = /aria-label=/i.test(svgContent);
    
    if (!hasTitle && !hasAriaLabel) {
      // Add a title element for accessibility if none exists
      const titleElement = `<title>${baseName.replace(/-/g, ' ')}</title>`;
      svgContent = svgContent.replace(/<svg([^>]*)>/i, `<svg$1>${titleElement}`);
    }
    
    fs.writeFileSync(filePath, svgContent);
  });
}

// Process SVG files
function processSVGs() {
  if (!fs.existsSync(config.svgDirectory)) {
    console.log('SVG directory not found');
    return;
  }
  
  setAccessibleNames();
  console.log('SVG processing complete');
}

// Initialize the application
function init() {
  console.log('Initializing SVG processor...');
  processSVGs();
}

module.exports = {
  setAccessibleNames,
  processSVGs,
  init,
  config,
};

init();