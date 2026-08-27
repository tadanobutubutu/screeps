// main.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const { formatTable, parseTableData, validateTableAccessibility, validateTableStructure } = require('./utils/tableUtils');

app.use(express.static('public'));
app.use(express.json());

// ... (existing routes) ...

app.post('/api/table/validate', (req, res) => {
    try {
        const tableData = req.body.data;
        const table = parseTableData(tableData);

        if (!validateTableAccessibility(table)) {
            return res.status(400).json({ success: false, message: 'Table lacks a language attribute' });
        }

        if (!validateTableStructure(table)) {
            return res.status(400).json({ success: false, message: 'Table structure is invalid' });
        }

        res.json({ success: true, message: 'Table is valid' });
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