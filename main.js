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
};

// Auto-bootstrap if running directly
if (require.main === module) {
  bootstrap();
}