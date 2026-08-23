const fs = require('fs');
const path = require('path');

function generateHTML(content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation</title>
</head>
<body>
    <header>
        <h1>Header</h1>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`;
}

function processIndexHTML() {
    const indexPath = path.join(__dirname, 'docs', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Check if <main> tag already exists
        if (!content.includes('<main>')) {
            // Extract body content (excluding header/footer if present)
            const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/);
            if (bodyMatch) {
                const bodyContent = bodyMatch[1].trim();
                // Wrap in <main> tag
                const mainContent = `    <main>\n        ${bodyContent}\n    </main>`;
                content = content.replace(bodyContent, mainContent);
                fs.writeFileSync(indexPath, content, 'utf8');
                console.log('Added <main> landmark to docs/index.html');
            }
        }
    }
}

// If this module is run directly
if (require.main === module) {
    processIndexHTML();
}

module.exports = { generateHTML, processIndexHTML };