(() => {
  // ... Existing code ...

  function wrapContentInMain(element) {
    const main = document.createElement("main");
    main.appendChild(element);
    return main;
  }

  // ... Existing code ...
})();