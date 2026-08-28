// main.js

// TODO: Implement this function for checking landmark structure
function checkLandmarkStructure(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const mainLandmark = doc.querySelector('main, [role="main"]');
  const landmarks = doc.querySelectorAll('[role], nav, header, footer, aside, main');
  
  return {
    hasMainLandmark: !!mainLandmark,
    landmarkCount: landmarks.length,
    landmarks: Array.from(landmarks).map(el => el.tagName.toLowerCase() + (el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : ''))
  };
}