const headers = document.querySelectorAll('th');

headers.forEach((header) => {
    header.setAttribute('scope', 'col');
});