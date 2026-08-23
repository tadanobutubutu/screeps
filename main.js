function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
}

// Adding the lang attribute to the root HTML element
document.documentElement.lang = 'en';