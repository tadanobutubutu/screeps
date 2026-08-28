// TODO: Implement wrapPrimaryContentInMain function

function wrapPrimaryContentInMain(content) {
  const main = document.createElement('main');
  if (typeof content === 'string') {
    main.innerHTML = content;
  } else if (content instanceof Element) {
    main.appendChild(content);
  }
  return main;
}