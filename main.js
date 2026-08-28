(() => {
  // Your existing code here...

  const setAccessibleNamesToSVGs = (svgData) => {
    svgData.forEach((svg) => {
      const id = svg.attributes.getNamedItem("id")?.value || `svg${Math.random()}`;
      svg.attributes.setNamedItem((
        new DOMParser().parseFromString(`<title id="${id}">${svg.nodeName}</title>`, "text/html")
          .head.firstElementChild
      ));
      svg.attributes.setNamedItem((
        new DOMParser().parseFromString(`<desc id="${id}">${svg.outerHTML}</desc>`, "text/html")
          .head.firstElementChild
      ));
      svg.setAttribute('aria-labelledby', id);
    });
  };

  // TODO: Call setAccessibleNamesToSVGs with the SVG data here...

  // Your existing exports here...
})();