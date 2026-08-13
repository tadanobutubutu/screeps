let posthogInitialised = false;
let initInstance = {};
let integration = {};
let apiKey = '';
let logging = require('./utils.logging');
let getTaskById = () => {};
let updateDependencyVersions = () => {};
let updateNpmPackage = () => {};
let createAsyncUpdateTask = () => {};
let visualizeMemory = () => {};

// New function to update posthog-js
async function initPosthog(options) {
    if (posthogInitialised) return;

    // Existing initialisation code...

    // Add the new posthog instance to the global scope
    if (typeof window !== 'undefined') {
        window.posthog = initInstance;
    }
}

// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

// Task Manager implementations for tests
let tasks = [];
let taskIdCounter = 0;

const addTask = (title, priority = 'medium', tags = []) => {
    taskIdCounter++;
    tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });
    return taskIdCounter;
};

module.exports = {
    logging,
    addTask,
    clearAllTasks: () => {
        tasks = [];
    },
    resetTaskIdCounter: () => {
        taskIdCounter = 0;
    },
    getTaskCount: () => tasks.length,
    getTasksSortedByTitle: () =>
        [...tasks].sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0)),
    getTasksSortedAlphabetically: (asc = true) =>
        [...tasks].sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (asc) return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
            return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
        }),
    getIncompleteTasks: () => tasks.filter((t) => !t.completed),
    getCompletedTasks: () => tasks.filter((t) => t.completed),
    completeTask: (id) => {
        const t = tasks.find((x) => x.id === id);
        if (t) t.completed = true;
    },
    removeTask: (id) => {
        tasks = tasks.filter((t) => t.id !== id);
    },
    getTaskById,
    updateDependencyVersions,
    updateNpmPackage,
    createAsyncUpdateTask,
    visualizeMemory,
};
