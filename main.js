function addLandmarkRegion(element, label) {
  if (!element) return; // Ensure the element exists

  element.setAttribute('role', 'region');
  element.setAttribute('aria-label', label);
}