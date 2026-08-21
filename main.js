// Main.js - Updated to fix React Unique Landmarks (REACT_025) accessibility issue

import React from 'react';

const Main = ({ isLoading, hasError, errorMessage, children }) => {
    if (isLoading) {
        return (
            <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <p>Loading...</p>
            </section>
        );
    }

    if (hasError) {
        return (
            <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <h2>Error</h2>
                <p>{errorMessage || 'An unexpected error occurred.'}</p>
            </section>
        );
    }

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {children}
        </main>
    );
};

export default Main;