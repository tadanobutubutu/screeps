import React from 'react';
import ReactDOM from 'react-dom';

// Layout component from HEAD
const Layout = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        {/* ... */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

// App component from origin/main
const App = () => {
  return (
    <Layout>
      {/* ... existing content from origin/main would go here */}
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));