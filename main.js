import React from 'react';

function handleUnrotate(event) {
  event.preventDefault();
  // existing logic unchanged
  console.log('rotate back clicked');
}

// Replace the fake link with a proper button
export const UnrotateLink = () => (
  <button type="button" id="unrotate" onClick={handleUnrotate}>
    rotate back
  </button>
);

export default function App() {
  return (
    <div>
      <UnrotateLink />
    </div>
  );
}