// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section, article');
  return Array.from(landmarks);
}

module.exports = {
  checkLandmarkElements
};