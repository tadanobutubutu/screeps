// main.js
const express = require('express');
const path = require('path');
const fs = require('fs');

// TODO: Implement getSvgAccessibleName() function here
function getSvgAccessibleName(svgElement) {
    // Placeholder implementation
    // This function should extract and return an accessible name for the SVG element
    // based on its attributes or content. The actual implementation will depend on the
    // specific requirements and structure of the SVG elements.
    return svgElement.getAttribute('title') || 'Accessible Name';
}

const app = express();
const PORT = process.env.PORT || 3000;

// Import required module(s) - for fixing table structure issues
const { formatTable, parseTableData } = require('./utils/tableUtils');

app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/api/data', (req, res) => {
    const data = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 }
    ];
    res.json(data);
});

app.post('/api/table/generate', (req, res) => {
    try {
        const tableData = req.body.data;
        const formattedTable = formatTable(tableData);
        res.json({ success: true, table: formattedTable });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;