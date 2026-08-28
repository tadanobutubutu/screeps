import React from 'react';

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      {/* Content */}
      <span id="content">Content</span>
    </div>
  );
}

export default MyComponent;

function checkLandmarkElements(container) {
  const landmarkSelectors = [
    'header',
    'nav',
    'main',
    'article',
    'section',
    'aside',
    'footer'
  ];

  const landmarks = {};
  let hasAccessibleLandmarks = false;

  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    landmarks[selector] = elements.length;
    if (elements.length > 0) {
      hasAccessibleLandmarks = true;
    }
  });

  return {
    landmarks,
    hasAccessibleLandmarks,
    totalLandmarks: Object.values(landmarks).reduce((sum, count) => sum + count, 0)
  };
}