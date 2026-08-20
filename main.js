import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <html>
      <head>
        <title>My Application</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));