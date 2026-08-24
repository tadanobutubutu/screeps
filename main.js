// main.js - Add lang attribute to the HTML element
import { render } from 'react-dom';
import App from './App';

const rootElement = document.getElementById('root');

// Ensure HTML lang attribute is set for accessibility (REACT_015)
document.documentElement.setAttribute('lang', 'en');

render(<App />, rootElement);