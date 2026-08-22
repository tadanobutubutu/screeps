(() => {
  // ... Existing code ...

  function wrapContentInMain(element) {
    const main = document.createElement("main");
    main.appendChild(element);
    return main;
  }

  // ... Existing code ...

  // New function to add scope attribute to th elements
  function addScopeToTh(element) {
    if (element.tagName === 'TH') {
      element.setAttribute('scope', 'col');
    }
  }

  // ... Existing code ...

  // Example usage of addScopeToTh function
  // Assuming there is a function that creates table headers and appends them to the DOM
  function createTableHeaders(headers) {
    const table = document.createElement('table');
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      addScopeToTh(th);
      table.appendChild(th);
    });
    return table;
  }

  // ... Existing code ...

  // New function to replace the fake link with a button for better accessibility
  function replaceFakeLinkWithButton() {
    const fakeLink = document.getElementById('unrotate');
    if (fakeLink) {
      const button = document.createElement('button');
      button.textContent = 'rotate back';
      button.onclick = fakeLink.onclick; // Copy the onclick handler to the new button
      fakeLink.parentNode.replaceChild(button, fakeLink);
    }
  }

  // ... Existing code ...

  // Call the new function to replace the fake link when the script loads
  replaceFakeLinkWithButton();

  // ... Existing code ...
})();