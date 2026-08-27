// TODO: Implement function for adding proper landmark regions

function addLandmarkRegions() {
  const existingMain = document.querySelector('main');
  
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    mainElement.id = 'main-content';
    document.body.insertBefore(mainElement, document.body.firstChild);
  }

  const regions = [
    { tag: 'header', role: 'banner', id: 'site-header' },
    { tag: 'nav', role: 'navigation', id: 'main-nav' },
    { tag: 'footer', role: 'contentinfo', id: 'site-footer' }
  ];

  regions.forEach(region => {
    if (!document.querySelector(`#${region.id}`)) {
      const element = document.createElement(region.tag);
      element.id = region.id;
      element.setAttribute('role', region.role);
      document.body.appendChild(element);
    }
  });

  if (!document.querySelector('aside')) {
    const aside = document.createElement('aside');
    aside.id = 'sidebar';
    aside.setAttribute('role', 'complementary');
    const main = document.querySelector('main') || document.body;
    main.appendChild(aside);
  }
}

export { addLandmarkRegions };