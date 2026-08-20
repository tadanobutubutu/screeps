// main.js - Application entry point
// This file serves as the main entry point for the application

const React = require('react');
const ReactDOM = require('react-dom/client');

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

// Export for testing and module usage
module.exports = {
  bootstrap,
  // Preserve any existing exports
};

// Auto-bootstrap if running directly
if (require.main === module) {
  bootstrap();
}