import React from 'react';

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