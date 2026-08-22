const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server running on port 3000'));