const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = [...document.querySelectorAll('[role="landmark"]')];
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmarkElements[index].nodeName.toLowerCase()}-${index + 1}`);
      }
    });
  },

  // ... existing code (from both conflicting branches)
};

// ... rest of the code (keeping both changes)