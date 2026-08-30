function ensureUniqueLandmarks(doc) {
  const results = { processed: 0, updated: 0 };
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside'];

  landmarkTags.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('role', tag);
          results.updated++;
        }
        results.processed++;
      });
    }
  });

  // New function: validateLandmark
  function validateLandmark(element, landmarkType) {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    if (!role || role !== landmarkType) {
      throw new Error(`Element is not a valid ${landmarkType} landmark`);
    }
  }

  // New function: validateLandmarkStructure
  function validateLandmarkStructure() {
    const mainLandmark = document.querySelector('[role="main"], main');
    if (!mainLandmark) {
      throw new Error('Document must have a main landmark (role="main" or <main> element)');
    }

    // Check for duplicate banners
    const banners = document.querySelectorAll('[role="header"]');
    if (banners.length > 1) {
      throw new Error('Document should have at most one banner or header landmark');
    }

    // Check for duplicate contentinfo
    const contentinfos = document.querySelectorAll('[role="footer"]');
    if (contentinfos.length > 1) {
      throw new Error('Document should have at most one contentinfo or footer landmark');
    }

    // Check for nested landmarks of the same type
    const allLandmarks = document.querySelectorAll(
      '[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"], [role="article"], [role="aside"], [role="figure"], [role="footer"], [role="header"], [role="landmark"], main, header, footer, aside, nav, section[aria-label], form[aria-label]'
    );

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      let parent = landmark.parentElement;
      while (parent) {
        const parentRole = parent.getAttribute('role') || parent.tagName.toLowerCase();
        if (parentRole === role) {
          throw new Error(`Landmark with role "${role}" should not be nested inside another with the same role`);
        }
        parent = parent.parentElement;
      }
    });
  }

  return results;
}