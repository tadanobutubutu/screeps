const logger = require('../utils.logging');

describe('utils.logging hardening', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = { logs: [] };
    });

    test('_escapeHTML escapes single quotes and backticks', () => {
        const input = "test 'quote' and `backtick` <tag>";
        const escaped = logger._escapeHTML(input);
        expect(escaped).toContain('&#39;');
        expect(escaped).toContain('&#96;');
        expect(escaped).toContain('&lt;');
        expect(escaped).toContain('&gt;');
    });

    test('getSafeStack limits output to 5 lines', () => {
        const longStack = 'line1\nline2\nline3\nline4\nline5\nline6\nline7';
        const safeStack = logger.getSafeStack(longStack);
        const lines = safeStack.split('\n');
        expect(lines.length).toBeLessThanOrEqual(5);
    });

    test('getSafeStack prefixes matched lines with "at"', () => {
        const stack = '    at Object.run (/home/user/main.js:10:5)';
        const safeStack = logger.getSafeStack(stack);
        expect(safeStack).toContain('at main.js:10:5');
    });
});
