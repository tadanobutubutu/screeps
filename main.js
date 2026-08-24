// Fixed layout icon definitions for REACT_041 — added aria-hidden="true" to decorative SVGs

module.exports = {
  dashboardLayout: {
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    },
  },
  appLayout: {
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🐛</text></svg>',
    },
  },

  // New function added
  getFeaturedProduct: function() {
    return {
      name: 'Product X',
      imageUrl: '/path/to/product-x.jpg',
    };
  },
};