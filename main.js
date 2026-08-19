import React from 'react';

// ===========================================
// Merged from HEAD: Table accessibility utility
// ===========================================
/**
 * Adds scope="col" attributes to table header cells that contain child elements.
 * This improves accessibility for screen readers.
 * @param {string} tableId - The ID of the table element
 */
export function enhanceTableAccessibility(tableId) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.warn(`Table with id "${tableId}" not found`);
    return;
  }
  
  const headers = table.getElementsByTagName('th');
  
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].children.length > 0) {
      headers[i].setAttribute('scope', 'col');
    }
  }
}

// ===========================================
// Merged from origin/main: RotateBack Component
// ===========================================
// Assuming there is a component called RotateBack that uses the anchor tag
class RotateBack extends React.Component {
  render() {
    // ... other component code ...

    // Replace the anchor tag with a button
    return (
      <div>
        {/* Other content */}
        <button id="unrotate" onClick={this.rotateBackHandler}>rotate back</button>
        {/* Other content */}
      </div>
    );
  }

  rotateBackHandler = () => {
    // Handler logic for rotating back
    console.log('Rotating back...');
    // Perform the necessary action to rotate back
  }
}

export default RotateBack;