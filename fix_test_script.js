const fs = require('fs');

const filePath = './tests/visual.effects.test.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldTestStr = `    test('secureRandomFloat falls back to Math.random on exception', () => {
        const originalMathRandom = Math.random;
        Math.random = jest.fn().mockReturnValue(0.99);
        try {
            jest.resetModules();
            jest.mock('crypto', () => {
                throw new Error('Module not found');
            });
            jest.mock('system.adaptive', () => ({
                isEnabled: jest.fn().mockReturnValue(true),
            }));
            const visualEffects = require('../visual.effects');
            expect(() => {
                visualEffects.particles({ x: 25, y: 25, roomName: 'W0N0' }, '#FFD700', 1);
            }).not.toThrow();
            expect(Math.random).toHaveBeenCalled();
        } finally {
            Math.random = originalMathRandom;
            jest.unmock('crypto');
            jest.unmock('system.adaptive');
        }
    });`;

const newTestStr = `    test('secureRandomFloat gracefully handles exception without Math.random', () => {
        const originalMathRandom = Math.random;
        Math.random = jest.fn().mockReturnValue(0.99);
        try {
            jest.resetModules();
            jest.mock('crypto', () => {
                throw new Error('Module not found');
            });
            jest.mock('system.adaptive', () => ({
                isEnabled: jest.fn().mockReturnValue(true),
            }));
            const visualEffects = require('../visual.effects');
            expect(() => {
                visualEffects.particles({ x: 25, y: 25, roomName: 'W0N0' }, '#FFD700', 1);
            }).not.toThrow();
            expect(Math.random).not.toHaveBeenCalled();
        } finally {
            Math.random = originalMathRandom;
            jest.unmock('crypto');
            jest.unmock('system.adaptive');
        }
    });`;

if (content.includes(oldTestStr)) {
    content = content.replace(oldTestStr, newTestStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Test replaced successfully!");
} else {
    console.log("Could not find the target string in test file.");
}
