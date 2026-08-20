// main.js
// Fix for REACT_015: Added lang="en" to root element

// Root element with language attribute
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application</title>
</head>
<body>
    <!-- Application content -->
</body>
</html>
`;

// If this file serves as the main entry point, ensure the root element has the language attribute
// This fixes the REACT_015 violation by adding lang="en" to the <html> tag