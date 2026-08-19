// REACT_036 Fix: Changed <a href="#"> to <button>
//
// BEFORE:
// <a id="unrotate" href="#">rotate back</a>
//
// AFTER:
// <button id="unrotate">rotate back</button>

// REACT_041 Fix: Added aria-hidden="true" to decorative SVGs
// Added to both layout.tsx files as they appear to be decorative favicons
const decorativeSvgProps = {
  'aria-hidden': 'true',
  role: 'img'
};

// Export the decorative SVG props for use in layout components
export { decorativeSvgProps };