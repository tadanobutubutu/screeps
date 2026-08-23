// Example of how to dynamically add the scope attribute to th elements
const tableElements = document.querySelectorAll('th');
tableElements.forEach((th) => {
  th.setAttribute('scope', 'col');
});