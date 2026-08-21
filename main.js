// main.js

// Example React component with the fix applied
export function ImageRotator({ onRotate }) {
  // ... existing code for rotation logic ...

  return (
    <div className="image-rotator">
      {/* Image display logic */}
      
      {/* FIX: Changed from <a href="#"> to <button> for proper accessibility */}
      <button id="unrotate" onClick={onRotate}>
        rotate back
      </button>
    </div>
  );
}

// If there's a render function or component export
export default function App() {
  return (
    <div>
      <ImageRotator onRotate={() => {}} />
    </div>
  );
}