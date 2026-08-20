import React from 'react';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        {/* Rest of the body content */}
        {/* Replacing the <a> tag with a <button> */}
        <button id="unrotate" onClick={() => {/* Your function to rotate back here */}}>rotate back</button>
      </body>
    </html>
  );
}

export default App;