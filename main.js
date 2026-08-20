function createTable(headers, rows) {
    const headerRow = headers.map(h => `<th scope="col">${h}</th>`).join('');
    const bodyRows = rows.map(row => 
        '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
    ).join('');
    return `<table lang="en"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function printTable(title, data) {
    if (!data || data.length === 0) {
        console.log('No data to display');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(h => item[h] || ''));
    
    console.log(`%c${title}`, 'font-weight: bold; color: #ff0;');
    console.log(createTable(headers, rows));
}

module.exports = { createTable, printTable };