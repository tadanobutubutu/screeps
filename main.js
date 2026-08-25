// docs/dependency-graph.html

(function () {
  'use strict';

  // existing code...

  // wrap the table in a main tag
  const tableContainer = document.getElementById('table-rotated');
  const main = document.createElement('main');
  main.appendChild(tableContainer);
  document.body.appendChild(main);

  // existing code...
})();