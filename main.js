import React from 'react';
import ReactDOM from 'react-dom';

function Page() {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <div id="root"></div>
        {/* Adding aria-label to the favicon SVG */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>" type="image/svg+xml">
      </body>
    </html>
  );
}

ReactDOM.render(<Page />, document.getElementById('root'));