// main.js

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

// Existing dependency storage
let dependencies = [
    { name: 'lodash', version: '4.17.21' },
    { name: 'express', version: '4.18.2' },
    { name: 'react', version: '18.2.0' }
];

function getDependencies() {
    return dependencies;
}

function addDependency(name, version) {
    dependencies.push({ name, version });
    return dependencies;
}

function removeDependency(name) {
    dependencies = dependencies.filter(dep => dep.name !== name);
    return dependencies;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    return dependencies.length;
}

// Accessibility fix: Add lang attribute to HTML element
function setHtmlLangAttribute(lang = 'en') {
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }
}

module.exports = {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    setHtmlLangAttribute
};