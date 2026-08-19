// main.js before fix
export function RotateBackLink() {
  return (
    <div>
      {/* Incorrect anchor usage for in-page navigation */}
      <a id="unrotate" href="#">rotate back</a>
    </div>
  );
}