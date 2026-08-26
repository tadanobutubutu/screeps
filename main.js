// Importing required libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Function for making the application accessible
const makeAccessible = (Component) => {
  return (props) => {
    const { onKeyPress } = props;

    // Attaching keyboard accessibility event handler
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onKeyPress();
      }
    };

    // Setting up keyboard accessibility
    document.addEventListener('keydown', handleKeyPress);

    // Rendering the accessible application
    return (
      <Component
        // Passing the code for keyboard accessibility event handling
        onKeyPress={() => {
          document.removeEventListener('keydown', handleKeyPress);
          onKeyPress();
        }}
        {...props}
      />
    );
  };
};

// Import your main application component here
import MyApp from './MyApp';

// Making the application accessible by wrapping it with the makeAccessible function
const MyAccessibleApp = makeAccessible(MyApp);

// The main function running the app
const runMyApp = () => {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        {/* Routes for your application */}
        <Route path="/" component={MyAccessibleApp} />
      </Switch>
    </BrowserRouter>,
    document.getElementById('root')
  );
};

// Exporting the runMyApp function to run the application
export default runMyApp;