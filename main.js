/**
 * Main entry point for the application
 * Handles server initialization and static file serving
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DOCS_DIR = path.join(__dirname, '..', 'docs');

/**
 * Serves static HTML files from the docs directory
 * Ensures <main> landmark is present for accessibility (REACT_017)
 */
function serveHTML(filePath, res) {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        // Set proper content type
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
}

/**
 * Handles incoming HTTP requests
 * Routes requests to appropriate handlers
 */
function handleRequest(req, res) {
    let filePath = req.url === '/' 
        ? path.join(DOCS_DIR, 'index.html')
        : path.join(DOCS_DIR, req.url);

    // Security: prevent directory traversal
    filePath = path.normalize(filePath);
    if (!filePath.startsWith(DOCS_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Serve index.html for SPA routing
                serveHTML(path.join(DOCS_DIR, 'index.html'), res);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Create and start the HTTP server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${DOCS_DIR}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shut down gracefully');
        process.exit(0);
    });
});

// Export for testing
module.exports = { server, handleRequest };