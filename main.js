import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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