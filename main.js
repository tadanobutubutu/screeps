// main.js

// Preserve all existing code, exports, and functions from current main.js.

// Add the following changes in the specified locations

// dashboard/app/layout.tsx:7
import React from "react";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
                   <title>Screeps Dashboard</title>
                   <text y=".9em" font-size="90">🐛</text>
                 </svg>`;

const DashboardLayout = ({ children }) => {
  //....(your existing code here)........

  return (
    <div className="layout">
      {/*....(your existing code here)....*/}

      <div className="header-mobile">
        {/*....(your existing code here)....*/}
        <div className="header-icon">
          <img src={icon} alt="Screeps" />
          {/* Replace `icon` with `iconSvg` */}
          <div dangerouslySetInnerHTML={{ __html: iconSvg }} />
        </div>
      </div>

      {/*....(your existing code here)....*/}
    </div>
  );
};

// app/layout.tsx:7
import React from "react";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard">
                   <title>Screeps Dashboard</title>
                   <text y=".9em" font-size="90">🐛</text>
                 </svg>`;

const Layout = ({ children }) => {
  //....(your existing code here)........

  return (
    <div className="layout">
      {/*....(your existing code here)....*/}

      <div className="header-mobile">
        {/*....(your existing code here)....*/}
        <div className="header-icon">
          <img src={icon} alt="Screeps" />
          {/* Replace `icon` with `iconSvg` */}
          <div dangerouslySetInnerHTML={{ __html: iconSvg }} />
        </div>
      </div>

      {/*....(your existing code here)....*/}
    </div>
  );
};

export default Layout;