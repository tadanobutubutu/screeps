import React from 'react';
import { createRoot } from 'react-dom/client';

// Main App Component
function App() {
    return (
        <main>
            <div id="home">
                <table id="table-rotated">
                    {/* Table content */}
                </table>
            </div>
            <div className="container">
                <h2>Quality & Metrics Reports</h2>
                <p>
                    This repository is fully optimized with automated tools. Explore the generated
                    reports below:
                </p>
                <div className="links">
                    <a href="...">Plato Code Complexity Report</a>
                    <a href="...">Dependency Graph</a>
                </div>
            </div>
        </main>
    );
}

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);