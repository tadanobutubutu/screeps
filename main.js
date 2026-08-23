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
    if (element && element.nodeName === "TH") {
      element.setAttribute("scope", "col");
    }
  }

  // ... Existing code ...

  function createTableHeaders(headers) {
    const table = document.createElement("table");
    headers.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      addScopeToTh(th);
      table.appendChild(th);
    });
    return table;
  }

  // ... Existing code ...

  function replaceFakeLinkWithButton() {
    const fakeLink = document.getElementById("unrotate");
    if (fakeLink) {
      const button = document.createElement("button");
      button.textContent = "rotate back";
      button.onclick = fakeLink.onclick;
      // Copy any additional properties/handlers if necessary
      fakeLink.parentNode.replaceChild(button, fakeLink);
    }
  }

  function addScopeToThs(elements) {
    if (elements && elements.length) {
      elements.forEach(element => {
        addScopeToTh(element);
      });
    } else if (elements && typeof elements.each === "function") {
      // Fallback for jQuery-like objects
      elements.each(function() {
        addScopeToTh(this);
      });
    }
  }

  // ... Existing code ...

  replaceFakeLinkWithButton();

  // ... Existing code ...

  module.exports = {
    wrapContentInMain,
    addScopeToTh,
    createTableHeaders,
    replaceFakeLinkWithButton,
    addScopeToThs
  };
})();