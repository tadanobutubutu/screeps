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
      </body>
    </html>
  );
}

ReactDOM.render(<Page />, document.getElementById('root'));