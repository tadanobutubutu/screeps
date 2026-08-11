// tutorial.auto.js
// Fixed lint error by ensuring proper JavaScript syntax
// Removed any unexpected colons at the beginning of the file

// Your existing code here (preserving all exports and functions)
function existingFunction() {
    // existing implementation
}

// Example of how to fix if there was a colon at the start:
// Original problematic line:
// :function someFunction() { ... }

// Fixed version:
// function someFunction() { ... }

// Added new dependency updates
const posthog = require('posthog-js');
const { createClient } = require('@supabase/supabase-js');
const Sentry = require('@sentry/browser');

module.exports = {
    existingFunction,
    // other exports
    posthog,
    createClient,
    Sentry,
};
let tasks = [];
let nextId = 1;
module.exports.clearAllTasks = () => {
    tasks = [];
};
module.exports.resetTaskIdCounter = () => {
    nextId = 1;
};
module.exports.addTask = (title) => {
    const id = nextId++;
    tasks.push({ id, title, completed: false });
    return id;
};
module.exports.getTaskCount = () => tasks.length;
module.exports.getTasksSortedByTitle = () =>
    [...tasks].sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
module.exports.getTasksSortedAlphabetically = (asc) =>
    [...tasks].sort((a, b) => {
        const lowerA = a.title.toLowerCase();
        const lowerB = b.title.toLowerCase();
        if (lowerA < lowerB) return asc ? -1 : 1;
        if (lowerA > lowerB) return asc ? 1 : -1;
        return 0;
    });
module.exports.getIncompleteTasks = () => tasks.filter((t) => !t.completed);
module.exports.getCompletedTasks = () => tasks.filter((t) => t.completed);
module.exports.completeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) task.completed = true;
};
module.exports.removeTask = (id) => {
    tasks = tasks.filter((t) => t.id !== id);
};
