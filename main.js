const rotateBack = () => {
  // Existing logic for rotating back, if any
  console.log('Rotating back...');
};

document.addEventListener('DOMContentLoaded', () => {
  const unrotateButton = document.getElementById('unrotate');
  unrotateButton.addEventListener('click', rotateBack);
});

// Sampled code for adding the scope attribute
const table = document.querySelector('table');

if (table) {
    for (let i = 0; i < table.rows.length; i++) {
        const headers = table.rows[i].cells;
        if (i === 0) {
            for (let j = 0; j < headers.length; j++) {
                headers[j].setAttribute('scope', 'col');
            }
        }
    }
}