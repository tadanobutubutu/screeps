// main.js
const express = require('express');
const path = require('path');

// =====================================================
// NOTE: To fix the REACT_015 accessibility issue (missing lang attribute on <html>),
// the change needs to be made in your HTML template file (e.g., public/index.html), NOT in main.js.
// 
// Please add lang="en" to your <html> tag in the HTML template file:
// 
// Before: <html>
// After:  <html lang="en">
// 
// If you need me to update main.js for any other reason (e.g., adding exports, functions),
// please provide the actual current main.js file content above.
// =====================================================

const app = express();
const PORT = process.env.PORT || 3000;

// Import required module(s) - for fixing table structure issues
const { formatTable, parseTableData } = require('./utils/tableHelpers');

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