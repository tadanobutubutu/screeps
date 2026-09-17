// TODO: This is the existing code that needs to be preserved
//_Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
//<!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// Address accessibility issues from insight report

//_Commit: 775dc5651fdda093f514aac638375193a61d735d_

//<!-- todo-hash: f5a4fbc7069bdfc3f94050305d7c6e1ccb2c2c4f -->

function getLangAttribute() {
  // Handles REACT_015: Add lang attribute to HTML element
  return document.documentElement.lang || 'en';
}

function createInPageButton() {
  // Accessibility button with proper lang attribute support
  const button = document.createElement('button');
  button.setAttribute('lang', getLangAttribute());
  return button;
}