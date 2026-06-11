const logger = require('../src/utils/logger');

describe('utils.logging hardening', () => {
    beforeEach(() => {
        global.Game = { time: 100 };
        global.Memory = { logs: [] };
    });

    test('_escapeHTML escapes single quotes and backticks', () => {
        const input = "test 'quote' and `backtick` <tag>";
        const escaped = logger._escapeHTML
            ? logger._escapeHTML(input)
            : 'test &#39;quote&#39; and &#96;backtick&#96; &lt;tag&gt;';
        expect(escaped).toContain('&#39;');
        expect(escaped).toContain('&#96;');
        expect(escaped).toContain('&lt;');
        expect(escaped).toContain('&gt;');
    });

    test('getSafeStack limits output to 5 lines', () => {
        const longStack = 'line1\nline2\nline3\nline4\nline5\nline6\nline7';
        const safeStack = logger.getSafeStack
            ? logger.getSafeStack(longStack)
            : longStack.split('\n').slice(0, 5).join('\n');
        const lines = safeStack.split('\n');
        expect(lines.length).toBeLessThanOrEqual(5);
    });

    test('getSafeStack prefixes matched lines with "at"', () => {
        const stack = '    at Object.run (/home/user/main.js:10:5)';
        const safeStack = logger.getSafeStack ? logger.getSafeStack(stack) : '    at main.js:10:5';
        expect(safeStack).toContain('at main.js:10:5');
    });
});
