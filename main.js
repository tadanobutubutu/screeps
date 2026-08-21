import React from 'react';

const WrappedDependencyGraph = () => {
  const htmlString = `
    <html lang="en">
      <!-- Original HTML content... -->
    </html>
    `;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default WrappedDependencyGraph;