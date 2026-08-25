// main.js

// TODO: Implement wrapPrimaryContentInMain function

function wrapPrimaryContentInMain(content) {
  if (typeof content === 'string') {
    return `<main>${content}</main>`;
  }
  
  if (content instanceof HTMLElement) {
    const main = document.createElement('main');
    while (content.firstChild) {
      main.appendChild(content.firstChild);
    }
    return main;
  }
  
  return content;
}

module.exports = { wrapPrimaryContentInMain };