// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:
// export function someFunction() {
//   // ...function implementation...
// }

// Existing code continues here...

// Ensure the new function is available as an export if needed
function newFunction(message = 'Hello from newFunction') {
  // Example logic: return a formatted message with timestamp
  return `${message} - ${new Date().toISOString()}`;
}

// Attach the new function to the app so it can be accessed externally
if (typeof app !== 'undefined') {
  app.newFunction = newFunction;
}

// Main application entry point
// Handles server initialization, routing, and view rendering

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    service: 'main-app',
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime()
  });
});

// TODO: Implement renderIndexView functionality
function renderIndexView(req, res, options = {}) {
  const defaultOptions = {
    title: 'Welcome',
    user: req.user || null,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  };

  const viewOptions = { ...defaultOptions, ...options };

  // Check if index template exists
  const indexPath = path.join(__dirname, 'views', 'index.ejs');
  const hasCustomTemplate = fs.existsSync(indexPath);

  if (hasCustomTemplate) {
    res.render('index', viewOptions);
  } else {
    // Fallback to basic HTML response if no template
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${viewOptions.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
          .meta { color: #666; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h1>${viewOptions.title}</h1>
        <div class="card">
          <p>Application is running successfully.</p>
          <p class="meta">Version: ${viewOptions.version}</p>
          <p class="meta">Timestamp: ${viewOptions.timestamp}</p>
          ${viewOptions.user ? `<p class="meta">User: ${JSON.stringify(viewOptions.user)}</p>` : ''}
        </div>
      </body>
      </html>
    `);
  }
}

// Index route using the new renderIndexView function
app.get('/', (req, res) => {
  renderIndexView(req, res, { title: 'Home Page' });
});

// Additional routes can be added here

// Error handling middleware
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// Export the app (and the attached newFunction) for external use
module.exports = app;