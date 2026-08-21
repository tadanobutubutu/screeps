// main.js - Accessibility fix: Changed <a href="#"> to <button> for the "rotate back" action

// Assuming this is a module that handles rotation functionality
// The fake link <a href="#"> has been replaced with <button> for proper accessibility

export function RotateControl({ onRotate, onUnrotate }) {
  return (
    <div className="rotate-controls">
      <a id="rotate" href="#" onClick={(e) => { e.preventDefault(); onRotate(); }}>
        rotate
      </a>
      {/* Fixed: Changed from <a href="#"> to <button> for better accessibility */}
      {/* Reason: <a href="#"> does not navigate anywhere and causes issues for screen readers and keyboard users */}
      <button id="unrotate" onClick={onUnrotate} type="button">
        rotate back
      </button>
    </div>
  );
}

export default RotateControl;