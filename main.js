tsx
import React from 'react';

const Layout: React.FC = ({ children }) => (
    <div>
        <main>{children}</main>
    </div>
);

export default Layout;