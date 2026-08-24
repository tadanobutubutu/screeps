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