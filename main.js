// Assuming that you can access the correct SVG elements
const favicon = document.querySelector(".favicon-svg");
const appleIcons = document.querySelectorAll(".apple-svg");

// Add the accessible name (aria-label) to the SVG elements
favicon.setAttribute("aria-label", "Screeps Dashboard");

appleIcons.forEach((icon) => {
  icon.setAttribute("aria-label", "Screeps Dashboard");
});