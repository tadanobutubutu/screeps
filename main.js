// TODO: Implement wrapPrimaryContentInMain function, including the added logic

function wrapPrimaryContentInMain(content) {
  const main = document.createElement('main');
  
  if (typeof content === 'string') {
    main.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    main.appendChild(content);
  }
  
  return main;
}

export { wrapPrimaryContentInMain };