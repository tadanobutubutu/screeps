tsx
import React from 'react';
import './styles.css';

const Layout: React.FC = ({ children }) => {
  return (
    <body>
      <div className="layout">
        <header>
          <nav>
            <!-- Navigation menu -->
          </nav>
        </header>

        {/* Add a main landmark for the primary content */}
        <main>{children}</main>
      </div>
    </body>
  );
};

export default Layout;