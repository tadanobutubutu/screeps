tsx
import React from 'react';
// ... (rest of the imports)

/**
 * Add `aria-label` to the main element for better accessibility.
 */
const ACCESSIBLE_MAIN_ELEMENT_ARIA_LABEL = 'Dashboard';

const Dashboard = () => {
    // (rest of the Dashboard function)
    return (
        <React.Fragment>
            {/* Keep the content inside one single "main" */}
            <main aria-label={ACCESSIBLE_MAIN_ELEMENT_ARIA_LABEL}>
                // ... (rest of the dashboard content)
            </main>
        </React.Fragment>
    );
};

export default Dashboard;