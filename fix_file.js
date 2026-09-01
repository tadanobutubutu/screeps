const fs = require('fs')
let content = fs.readFileSync('main.js', 'utf8')

// The git checkout restored the initial state which is the broken file (syntax error and markdown)
// Let's replace it with the exact right file, which we can get by removing markdown and fixing the end.

content = content.replace(/^Looking at the error[\s\S]*?```javascript\n/, '')
content = content.replace(/```\s*$/, '')

// Replace Math.random with crypto
if (!content.includes("require('crypto')")) {
  content = "const crypto = require('crypto');\n" + content
}
content = content.replace(/Math\.floor\(Math\.random\(\) \* 10000\)/g, 'crypto.randomInt(10000)')
content = content.replace(
  /Math\.random\(\)/g,
  '(crypto.randomBytes(4).readUInt32LE() / 0xffffffff)'
)

// Fix the end of the file which is cut off
content = content.replace(
  / {2}\} catch \(error\) \{\n {4}logging\.log\('$/m,
  "  } catch (error) {\n    logging.log('error', `Failed to monitor stargazers: ${error.message}`);\n    throw error;\n  }\n}"
)

// Add exports for tests
const exportsToAdd = `
// Task Manager implementations for tests
let tasks = [];
let taskIdCounter = 0;

module.exports = {
  logging,
  addTask,
  clearAllTasks: () => { tasks = []; },
  resetTaskIdCounter: () => { taskIdCounter = 0; },
  getTaskCount: () => tasks.length,
  getTasksSortedByTitle: () => [...tasks].sort((a, b) => a.title < b.title ? -1 : (a.title > b.title ? 1 : 0)),
  getTasksSortedAlphabetically: (asc = true) => [...tasks].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (asc) return titleA < titleB ? -1 : (titleA > titleB ? 1 : 0);
    return titleA > titleB ? -1 : (titleA < titleB ? 1 : 0);
  }),
  getIncompleteTasks: () => tasks.filter(t => !t.completed),
  getCompletedTasks: () => tasks.filter(t => t.completed),
  completeTask: (id) => { const t = tasks.find(x => x.id === id); if (t) t.completed = true; },
  removeTask: (id) => { tasks = tasks.filter(t => t.id !== id); },
  getTaskById,
  updateDependencyVersions,
  updateNpmPackage,
  createAsyncUpdateTask,
  visualizeMemory
};
`
if (!content.includes('module.exports = {')) {
  content += exportsToAdd
}

// Ensure the `addTask` implementation in `main.js` correctly populates the array for the tests
content = content.replace(
  /const addTask = \(title, priority = 'medium', tags = \[\]\) => \{\n {2}\/\/ Stub implementation: returns a mock task ID\n {2}return crypto\.randomInt\(10000\);\n\};/,
    `const addTask = (title, priority = 'medium', tags = []) => {
  taskIdCounter++;
  tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });
  return taskIdCounter;
};`
)

fs.writeFileSync('main.js', content, 'utf8')
