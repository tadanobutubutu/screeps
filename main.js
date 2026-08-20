// Assuming the following is the JSX within the main.js file that includes the problematic anchor tag

export default function DependencyGraph() {
  // ... other code ...

  return (
    <div>
      {/* ... other JSX elements ... */}
      <button id="unrotate" onClick={() => {/* Functionality to rotate back */}}>rotate back</button>
      {/* ... other JSX elements ... */}
    </div>
  );
}

// ... rest of the main.js file ...