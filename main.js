import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <html lang="ja">
      <head>
        {/* ... other head elements ... */}
      </head>
      <body>
        <main>
          {/* primary content goes here */}
        </main>
        {/* ... rest of the body elements ... */}
      </body>
    </html>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));