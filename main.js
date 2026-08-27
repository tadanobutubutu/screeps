// main.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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
        // Note: REACT_027 (missing <th scope="col">) affects static HTML in docs/dependency-graph.html.
        // The scope attribute must be added directly to the <th> elements in that HTML file,
        // since this server does not generate the dependency-graph table.
        res.json({ success: true, table: tableData });
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