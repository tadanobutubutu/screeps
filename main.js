module.exports = {
  getGreeting: function() {
    return 'Hello, World!';
  },
  // Add a new function to set the lang attribute on the HTML element
  setLangAttribute: function(lang) {
    document.documentElement.lang = lang;
  },
  // ... any other new functions or changes requested in the issue
};