export const generateDependencyGraphHTML = () => {
  // Existing HTML template
  const template = `
    <html>
    <!-- ... -->
    </html>
  `;

  // Replace the original HTML with the modified one
  return template.replace('<html', '<html lang="en>');
};