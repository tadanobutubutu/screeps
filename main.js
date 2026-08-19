const tableRows = document.querySelectorAll('table tbody tr');
tableRows.forEach((row) => {
  const cells = row.querySelectorAll('th, td');
  cells[1].setAttribute('scope', 'col');
});

const rotateBackAction = () => {
  return `<button id="unrotate" type="button">rotate back</button>`;
};

export { rotateBackAction };