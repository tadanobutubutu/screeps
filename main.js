tsx
import React from 'react';
// ... (rest of the imports)

const Dashboard = () => {
    // (rest of the Dashboard function)
    return (
        <React.Fragment>
            {/* Keep the content inside one single "main" */}
            <main>
                {/* ... (rest of the dashboard content) */}
            </main>
            {/* Replace the duplicate <main> with a <section> or <article> */}
            <section>
                {/* ... (content that was previously in the duplicate <main>) */}
            </section>
        </React.Fragment>
    );
};

export default Dashboard;