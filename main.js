// REACT_015 fix: Ensure the root HTML element has a lang attribute for screen reader compatibility.
// This sets the document language to English; adjust if a different locale is needed.
// If in a browser environment, the attribute is applied to the document's root element.
// Existing code, exports, and functions from the original main.js are preserved above.
if (typeof document !== "undefined") {
  document.documentElement.lang = "en";
}