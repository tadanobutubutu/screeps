// Before (potentially causing the REACT_036 issue):
// <a href="#">Go to top</a>

// After:
// <button aria-label="Go to top" onClick={() => window.scrollTo(0, 0)}>Go to top</button>