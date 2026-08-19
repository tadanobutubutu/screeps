// main.js
// This file should contain JavaScript code, not HTML
// The HTML content should be moved to a separate file with .html or .jsx extension

// Example JavaScript content that would be appropriate for main.js:
import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import App from './App';

const Layout = ({ children }) => {
  return (
    <body>
      <Header />
      <main>{children}</main>
      <Footer />
    </body>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
  document.getElementById('root')
);

export default Layout;