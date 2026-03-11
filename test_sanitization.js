
const regex = /(?:[a-zA-Z]:)?(\/|\\)(?:.*[\/\\\\])?([^\/\\ ]+:\d+:\d+)/g;

const testCases = [
    {
        name: 'Unix absolute path',
        input: 'at Object.loop (/home/runner/work/screeps/screeps/main.js:335:15)',
        expected: 'at Object.loop (main.js:335:15)'
    },
    {
        name: 'Windows absolute path',
        input: 'at Object.loop (C:\\Users\\Admin\\Documents\\screeps\\main.js:335:15)',
        expected: 'at Object.loop (main.js:335:15)'
    },
    {
        name: 'Windows absolute path with drive letter and forward slashes',
        input: 'at Object.loop (C:/Users/Admin/Documents/screeps/main.js:335:15)',
        expected: 'at Object.loop (main.js:335:15)'
    },
    {
        name: 'Screeps internal path (simulated)',
        input: 'at /opt/screeps/src/main.js:10:5',
        expected: 'at main.js:10:5'
    },
    {
        name: 'Multiple lines',
        input: 'Error: Something went wrong\n    at Object.run (/home/user/project/utils.js:10:20)\n    at Object.loop (/home/user/project/main.js:5:10)',
        expected: 'Error: Something went wrong\n    at Object.run (utils.js:10:20)\n    at Object.loop (main.js:5:10)'
    }
];

let failed = false;
testCases.forEach(test => {
    const result = test.input.replace(regex, '$2');
    if (result === test.expected) {
        console.log(`✅ PASSED: ${test.name}`);
    } else {
        console.log(`❌ FAILED: ${test.name}`);
        console.log(`   Input:    ${test.input}`);
        console.log(`   Expected: ${test.expected}`);
        console.log(`   Actual:   ${result}`);
        failed = true;
    }
});

if (failed) {
    process.exit(1);
} else {
    console.log('\nAll regex tests passed!');
}
