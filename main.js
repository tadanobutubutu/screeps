const checkLandmarkElements = () => {
  const landmarks = document.querySelectorAll('[aria-label][role="landmark"]');

  if (landmarks.length === 0) {
    console.warn('No landmark elements found.');
    return;
  }

  landmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label');
    console.log(`Found landmark with label: ${label}`);
  });
};