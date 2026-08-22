import React, { useState } from 'react';

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch data and set data state
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {data && (
        <main>
          {/* Render your data here */}
          <h1>Data Title</h1>
          {/* ... */}
        </main>
      )}
      {!error && !data && <button onClick={fetchData}>Load Data</button>}
    </div>
  );
};

export default Dashboard;

'use strict';

// Button replacement for accessibility (anchor -> button)
const unrotateButton = document.getElementById('unrotate');
if (unrotateButton) {
  unrotateButton.outerHTML = `
    <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
      rotate back
    </button>
  `;
  unrotateButton.addEventListener('click', function () {
    rotateBack();
  });
}

// Rotate back animation function
function rotateBack() {
  const targets = document.querySelectorAll('.rotate-item');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Export for CommonJS and ES modules
module.exports = { rotateBack };
export { rotateBack };