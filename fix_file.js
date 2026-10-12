Here’s the resolved `fix_file.js` – all the changes from both sides have been merged into a single, clean script:

```js
/**
 * This script reads the broken 'main.js', cleans up the markdown
 * wrapper, replaces insecure Math.random calls with crypto primitives,
 * restores the truncated error‑handling block, then re‑writes a clean
 * version of 'main.js'.  Finally, it injects a test harness (the
 * `module.exports` block) if it isn’t already present.
 */

const fs = require('fs')
let content = fs.readFileSync('main.js', 'utf8')

// ---------- Strip the Markdown wrapper ----------
content = content.replace(/^Looking at the error[\s\S]*?```javascript\n/, '')
content = content.replace(/```\s*$/, '')

// ---------- Replace Math.random with crypto ----------
if (!content.includes("require('crypto')")) {
  content = "const crypto = require('crypto');\n" + content
}
content = content.replace(/Math\.floor\(Math\.random\(\) \* 10000\)/g, 'crypto.randomInt(10000)')
content = content.replace(
  /Math\.random\(\)/g,
  '(crypto.randomBytes(4).readUInt32LE() / 0xffffffff)'
)

// ---------- Repair the truncated catch block ----------
content = content.replace(
  / {2}\} catch \(error\) \{\n {4}logging\.log\('$/m,
  `  } catch (error) {\n    logging.log('error', \`Failed to monitor stargazers: ${error.message}\`);\n    throw error;\n  }\n}`
)

// ---------- Add test harness if missing ----------
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
    return titleA > titleB ? -1 : (titleA < titleB ? 1