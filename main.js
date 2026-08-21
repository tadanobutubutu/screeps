tsx
import React from 'react';
// ... (rest of the imports)

const Dashboard = () => {
    // (rest of the Dashboard function)
    return (
        <React.Fragment>
            {/* Keep the content inside one single "main" */}
            <main>
                {/* Add scope attribute to the th elements */}
                <table>
                    <thead>
                        <tr>
                            <th scope="col"><div>src/constants.js</div></th>
                            <th scope="col"><div>src/managers/roomManager.js</div></th>
                            <th scope="col"><div>src/managers/spawnManager.js</div></th>
                            <th scope="col"><div>src/managers/towerManager.js</div></th>
                            <th scope="col"><div>src/roles/builder.js</div></th>
                            {/* ... 21 further occurrences with the same scope attribute */}
                        </tr>
                    </thead>
                    {/* ... rest of the table */}
                </table>
                // ... (rest of the dashboard content)
            </main>
        </React.Fragment>
    );
};

export default Dashboard;