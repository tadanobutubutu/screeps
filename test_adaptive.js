
const assert = require('assert');

// Mock Screeps globals
global.Memory = {
    adaptive: {
        currentMode: 2 // NORMAL
    }
};
global.Game = {
    time: 100,
    cpu: {
        getUsed: () => 10,
        limit: 20,
        bucket: 10000
    }
};
global.RawMemory = {
    get: () => ({ length: 1000 })
};

// Import the system under test
const adaptiveSystem = require('./system.adaptive');

console.log('Running tests for system.adaptive.js...');

// Debug: check if adaptiveSystem is correctly loaded
if (!adaptiveSystem || Object.keys(adaptiveSystem).length === 0) {
    console.error('❌ Error: adaptiveSystem is not correctly exported!');
    process.exit(1);
}

// Test 1: NORMAL mode (default mock)
console.log('- Testing NORMAL mode...');
assert.strictEqual(adaptiveSystem.isEnabled('basicRoles'), true, 'basicRoles should be enabled in NORMAL');
assert.strictEqual(adaptiveSystem.isEnabled('emotions'), true, 'emotions should be enabled in NORMAL');
assert.strictEqual(adaptiveSystem.isEnabled('visualEffects'), false, 'visualEffects should be disabled in NORMAL');

// Test 2: EMERGENCY mode
console.log('- Testing EMERGENCY mode...');
global.Memory.adaptive.currentMode = adaptiveSystem.MODE.EMERGENCY;
assert.strictEqual(adaptiveSystem.isEnabled('basicRoles'), true, 'basicRoles should be enabled in EMERGENCY');
assert.strictEqual(adaptiveSystem.isEnabled('logging'), false, 'logging should be disabled in EMERGENCY');

// Test 3: MINIMAL mode
console.log('- Testing MINIMAL mode...');
global.Memory.adaptive.currentMode = adaptiveSystem.MODE.MINIMAL;
assert.strictEqual(adaptiveSystem.isEnabled('logging'), true, 'logging should be enabled in MINIMAL');
assert.strictEqual(adaptiveSystem.isEnabled('gamification'), false, 'gamification should be disabled in MINIMAL');

// Test 4: FULL mode
console.log('- Testing FULL mode...');
global.Memory.adaptive.currentMode = adaptiveSystem.MODE.FULL;
assert.strictEqual(adaptiveSystem.isEnabled('visualEffects'), true, 'visualEffects should be enabled in FULL');
assert.strictEqual(adaptiveSystem.isEnabled('advancedRoles'), true, 'advancedRoles should be enabled in FULL');

// Test 5: Fallback if Memory.adaptive is missing
console.log('- Testing fallback...');
delete global.Memory.adaptive;
assert.strictEqual(adaptiveSystem.isEnabled('basicRoles'), true, 'basicRoles should be enabled in fallback (NORMAL)');
assert.strictEqual(adaptiveSystem.isEnabled('emotions'), true, 'emotions should be enabled in fallback (NORMAL)');
assert.strictEqual(adaptiveSystem.isEnabled('visualEffects'), false, 'visualEffects should be disabled in fallback (NORMAL)');

console.log('✅ All tests passed!');
