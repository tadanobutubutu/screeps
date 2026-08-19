// Hypothetical snippet from main.js

import React from 'react';
import ReactDOM from 'react-dom';

// Assuming a functional component for the table
function DependencyGraph() {
  // ... other component logic ...

  // The table structure
  return (
    <table>
      <thead>
        <tr>
          {/* ... other <th> elements ... */}
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          {/* ... more <th> elements ... */}
          <th scope="col"><div>src/roles/builder.js</div></th>
          {/* ... more <th> elements ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... table body rows ... */}
      </tbody>
    </table>
  );
}

ReactDOM.render(<DependencyGraph />, document.getElementById('root'));