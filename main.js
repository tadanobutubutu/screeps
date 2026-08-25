// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
... = ... 'lang': 'en'};

// - REACT_017: Add/fix 4 landmark issues (Adding landmarks and identifying unique landmarks)
const App = () => {
  return (
    <Router>
      <div>
        <header role="banner">...</header>
        <main role="main">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
          </Switch>
        </main>
        <footer role="contentinfo">...</footer>
      </div>
    </Router>
  );
};

// - REACT_041: Add accessible names to 2 SVGs (Example using SVG images "logo" and "icon")
const Logo = () => (
  <svg role="img" aria-labelledby="logo-title logo-description">
    ...
    <title ... Logo</title>
    <desc ... is the Company's logo</desc>
  </svg>
);

const Icon = () => (
  <svg role="img" aria-labelledby="icon-title icon-description">
    ...
    <title id="icon-title">Contact Us Icon</title>
    <desc id="icon-description">This is the Contact Us icon</desc>
  </svg>
);

// Export the App and the two SVG components
export default App;
export { Logo, Icon };