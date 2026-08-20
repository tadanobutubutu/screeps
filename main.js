import React from 'react';  
import ReactDOM from 'react-dom/client';  
import App from './App';  
const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(  
  <React.StrictMode>  
    <html lang="en">  
      <head>  
        <meta charSet="UTF-8" />  
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
        <title>Screeps</title>  
        {/* SVG Favicon component for React runtime inclusion */}
        {import('./path/to/FaviconSVG').then((module) => (  
          <FaviconSVG />
        ))}
      </head>  
      <body>  
        <App />  
      </body>  
    </html>  
  </React.StrictMode>  
);  
export { app } from './App'; // Preserve existing exports