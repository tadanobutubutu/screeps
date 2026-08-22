// Assuming 'renderDependencyGraph' is a function that renders the HTML content
// including the `<html>` tag with the missing lang attribute.

function renderDependencyGraph() {
  // Your existing code to generate the HTML content...

  // Add the lang attribute to the <html> tag
  const htmlContentWithLang = htmlContent.replace(
    '<html>',
    '<html lang="en">'
  );

  // Continue with the rest of your rendering logic...
  // For example, write the updated content to a file or insert it into the DOM
}

// ... rest of your code