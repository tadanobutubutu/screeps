// main.js

// Original code
// <<<<<<< HEAD
class MyComponent extends React.Component {
  // ... existing code ...
  rotateBack() {
    // existing implementation that uses a fake link
    document.getElementById('unrotate').click();
  }
  // ... more code ...
}

export default MyComponent;
// =======
// ... some other code ...
// >>>>>>> branch-name
// >>>>>>> branch-name

// Updated code to replace the fake link with a button
class MyComponent extends React.Component {
  // ... existing code ...
  rotateBack() {
    // new implementation that uses a button instead of a fake link
    this.buttonElement.click();
  }
  render() {
    return (
      // ... other JSX ...
      <button
        id="unrotate"
        ref={(button) => { this.buttonElement = button; }}
        onClick={this.rotateBack.bind(this)}
      >
        rotate back
      </button>
      // ... other JSX ...
    );
  }
  // ... more code ...
}

export default MyComponent;