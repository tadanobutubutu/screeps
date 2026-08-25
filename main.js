tsx
import React from 'react';
import { useState } from 'react';

const AppLayout = () => {
    const [darkMode, setDarkMode] = useState(false);

    // ... other code ...

    return (
        <>
            <head>
                <link rel="apple-touch-icon" href={`${iconUrl}/apple-touch-icon.png`} />
                <meta name="theme-color" content={darkMode ? '#1e1e1e' : '#007FFF'} />
                <meta name="msapplication-config" content={`${iconUrl}/browserconfig.xml`} />
                <meta name="msapplication-TileColor" content={darkMode ? '#1e1e1e' : '#007FFF'} />
                <meta name="msapplication-square150x150Icon" content={`${iconUrl}/square150x150.png`} />

                {/* Add aria-label attribute to the favicon SVG */}
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link
                    rel="shortcut icon"
                    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>🐛</text></svg>"
                    aria-label="Screeps Dashboard"
                />

                {/* Add aria-hidden="true" to the decorative icon SVG on line 17 */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="1em"
                    height="1em"
                    focusable="false"
                    aria-hidden="true"
                >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                </svg>
                <title>Screeps Dashboard</title>
            </head>
            <body className={darkMode ? "dark" : ""}>
                {/* Other code */}
            </body>
        </>
    );
};

export default AppLayout;