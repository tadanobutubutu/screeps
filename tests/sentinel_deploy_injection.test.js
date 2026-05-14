/**
 * Sentinel: Verify environment variable injection in deploy.js
 */

const { injectEnvVars } = require('../deploy');

describe('deploy.js environment injection', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('injectEnvVars replaces process.env.VAR_NAME with actual value', () => {
        process.env.TEST_SECRET = 'supersecret123';
        const content = 'const secret = process.env.TEST_SECRET;';
        const result = injectEnvVars(content);
        expect(result).toBe('const secret = "supersecret123";');
    });

    test('injectEnvVars handles single and double quotes in environment values', () => {
        process.env.TEST_SECRET = 'it\'s a "secret"';
        const content = 'const secret = process.env.TEST_SECRET;';
        const result = injectEnvVars(content);
        // JSON.stringify will double escape for the JS string literal
        expect(result).toBe('const secret = "it\'s a \\"secret\\"";');
    });

    test('injectEnvVars handles backslashes in environment values', () => {
        process.env.TEST_SECRET = 'value\\with\\backslashes';
        const content = 'const secret = process.env.TEST_SECRET;';
        const result = injectEnvVars(content);
        expect(result).toBe('const secret = "value\\\\with\\\\backslashes";');
    });

    test('injectEnvVars returns "undefined" string if variable is not in process.env', () => {
        const content = 'const secret = process.env.NON_EXISTENT_VAR;';
        const result = injectEnvVars(content);
        expect(result).toBe('const secret = undefined;');
    });

    test('injectEnvVars respects word boundaries', () => {
        process.env.VAR = 'val';
        const content = 'const v = myprocess.env.VAR; const v2 = process.env.VAR2;';
        const result = injectEnvVars(content);
        // myprocess.env.VAR should NOT be matched. process.env.VAR2 should be replaced with undefined.
        expect(result).toBe('const v = myprocess.env.VAR; const v2 = undefined;');
    });

    test('injectEnvVars handles multiple variables', () => {
        process.env.VAR1 = 'val1';
        process.env.VAR2 = 'val2';
        const content = 'const v1 = process.env.VAR1; const v2 = process.env.VAR2;';
        const result = injectEnvVars(content);
        expect(result).toBe('const v1 = "val1"; const v2 = "val2";');
    });

    test('injectEnvVars handles variables in different contexts', () => {
        process.env.API_KEY = 'xyz789';
        const content = 'posthog.init(process.env.API_KEY, { ... });';
        const result = injectEnvVars(content);
        expect(result).toBe('posthog.init("xyz789", { ... });');
    });
});
