// docs/dependency-graph.html
document.querySelector('body').innerHTML = document.querySelector('body').outerHTML.replace(
  /(<body[^>]*)(.*?)<\/body>/s,
  '$1<main>$2</main></body>'
);

// docs/index.html
document.querySelector('body').innerHTML = document.querySelector('body').outerHTML.replace(
  /(<body[^>]*)(.*?)<\/body>/s,
  '$1<main>$2</main></body>'
);