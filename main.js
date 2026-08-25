function addAccessibleNameToSVGs() {
  // Assuming `icons` is an object containing SVG strings
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐛</text></svg>',
  };

  // Iterate over each SVG and add an aria-label
  Object.keys(icons).forEach(key => {
    icons[key] = icons[key].replace(/<svg.*?>/g, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="${key}">`);
    icons[key] = icons[key].replace(/<\/svg>/g, '</svg>');
  });

  return icons;
}