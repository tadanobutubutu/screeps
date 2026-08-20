// Example of updating an HTML document with the lang attribute
const htmlContent = `
<html>
<head>
    <title>Example Page</title>
</head>
<body>
    <!-- ... rest of the page content ... -->
</body>
</html>
`;

// Adding the lang attribute to the <html> tag
const updatedHtmlContent = htmlContent.replace(
  '<html>',
  '<html lang="en">'
);

// Output the updated HTML content
console.log(updatedHtmlContent);