// Add this line at the start of the file
const { userAgent } = require('user-agent');

// Add the lang attribute to the <html> element
const isWebBrowser = userAgent().isWebBrowser;
if (isWebBrowser) {
  const updatedHTML = `<!DOCTYPE html>\n<htmllang="en">\n${require('fs').readFileSync('./main.js', 'utf8')}`;
  process.stdout.write(updatedHTML);
} else {
  // Keep your existing code here
}

// Your existing functions and exports follow here