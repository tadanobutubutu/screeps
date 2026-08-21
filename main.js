tsx
import React from 'react';
// ... (rest of the imports)

const Dashboard = () => {
    // (rest of the Dashboard function)
    return (
        <React.Fragment>
            {/* Keep the content inside one single "main" */}
            <main>
                // ... (rest of the dashboard content)
                {/* Replace the anchor with a button for better accessibility */}
                <button id="unrotate" onClick={() => {/* Handle the action here */}}>rotate back</button>
            </main>
        </React.Fragment>
    );
};

export default Dashboard;