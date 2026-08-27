// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

// Some existing code here...

function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
}

module.exports = { renderHTML };