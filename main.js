import React from 'react';  
import ReactDOM from 'react-dom/client';  

const container = document.getElementById('root');  
if (container) {  
  const root = ReactDOM.createRoot(container);  
  root.render(<React.StrictMode><Layout><App /></Layout></React.StrictMode>);  
}  

// Layout component accessibility enhancements  
export default function Layout({ children }) {  
  if (process.env.NODE_ENV === 'production') {  
    return (  
      <>{children}</>  
      <script dangerouslySetInnerHTML={{  
        __html: `  
          window.addEventListener('load', function () {  
            document.querySelectorAll('svg').forEach(svg => {  
              switch(svg.parentElement.tagName.toLowerCase()) {  
                case 'app-layout':  
                  svg.setAttribute('aria-label', 'Application icon');  
                  break;  
                case 'dashboard-app-layout':  
                  svg.setAttribute('aria-label', 'Dashboard icon');  
                  break;  
                case 'home-app-layout':  
                  svg.setAttribute('aria-label', 'Home icon');  
                  break;  
              }  
            });  
          });  
        `  
      }} />  
    );  
  }  
  return <>{children}</>;  
}  

function initialize() {  
  return true;  
}  

module.exports = { initialize };