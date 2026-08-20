import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <Dashboard />
        {/* Rest of the body content */}
      </body>
    </html>
  );
}

export const Dashboard = ({ stats, error, refreshing, fetchStats }) => {
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyErr = () => {
    navigator.clipboard.writeText(error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Dashboard />);
};

export default App;