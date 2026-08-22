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
})();