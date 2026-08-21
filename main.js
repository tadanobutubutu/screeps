tsx
// Assuming icons are defined in this file or imported here
import React from 'react';

// Example icon structure (replace with actual structure)
const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

const Layout: React.FC = ({ children }) => {
    return (
        <div>
            {/* Render the icon or handle it as needed */}
            <img src={icons.icon} alt="Screeps Dashboard Icon" />
            {children}
        </div>
    );
};

export default Layout;