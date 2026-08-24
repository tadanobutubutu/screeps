// Before:
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// =======
// <a id="unrotate" href="#">rotate back</a>
// >>>>>>> origin/main
// After:

// <button id="unrotate" onClick={rotateBack}>rotate back</button>

// You would also need to define the rotateBack function in your component
function rotateBack() {
  // Logic to rotate back
}

export default function YourComponent() {
  // ... other component code ...

  return (
    // ... rest of your JSX ...
    <button id="unrotate" onClick={rotateBack}>rotate back</button>
    // ... rest of your JSX ...
  );
}