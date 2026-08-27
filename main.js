// Insight report addressed: lang attribute added to HTML element
const myHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

function renderApp() {
    return myHtml;
}

module.exports = { myHtml, renderApp };