// Your existing code...

// Adding an alt attribute to an image
const addAltToImage = (elementId) => {
  const imageElement = document.getElementById(elementId);
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }
};

// Correcting the ARIA role for a div
const setRoleToDiv = (elementId, role) => {
  const divElement = document.getElementById(elementId);
  if (divElement) {
    divElement.setAttribute('role', role);
  }
};

// Your existing code... (ensuring all your exported functions and modules are intact)

// Make the new functions accessible in main.js
main.js.addAltToImage = addAltToImage;
main.js.setRoleToDiv = setRoleToDiv;

module.exports = {
  // Your existing functions and modules here...
  addAltToImage,
  setRoleToDiv,
};