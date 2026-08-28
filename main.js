import axe from 'axe-core';

// ...

function myFunction() {
  const node = document.querySelector('#my-element');
  axe.analyze(node).then(results => {
    if (results.violations.length > 0) {
      // Handle the violations
    }
  });
}