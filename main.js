module.exports = {
  getGreeting: function() {
    return 'Hello, World!';
  },
  setLangAttribute: function(lang) {
    document.documentElement.lang = lang;
  },
  // ... any other new functions or changes requested in the issue
  // BEGIN NEW FUNCTIONS OR CHANGES
  calculateSquare: function(number) {
    return number * number;
  },
  // END NEW FUNCTIONS OR CHANGES
};