import { something } from './somewhere';
import './somewhere';

const main = (module) => {
    module.render(document);
};

module.exports = main;

// Add language attribute to HTML element
document.documentElement.lang = 'en';