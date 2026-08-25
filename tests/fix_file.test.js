const fs = require('fs');
let mockContent = '';

jest.mock('fs', () => ({
    readFileSync: jest.fn((path, encoding) => {
        if (path === 'main.js') return mockContent;
        return '';
    }),
    writeFileSync: jest.fn((path, content, encoding) => {
        if (path === 'main.js') mockContent = content;
    })
}));

describe('fix_file.js', () => {
    beforeEach(() => {
        jest.resetModules();
        // Set up the mock instance
        const fsMock = require('fs');
        fsMock.readFileSync.mockClear();
        fsMock.writeFileSync.mockClear();
        mockContent = '';
    });

    it('should correctly process the file content', () => {
        mockContent = `Looking at the error
\`\`\`javascript
const a = Math.random();
const b = Math.floor(Math.random() * 10000);
  } catch (error) {
    logging.log('
\`\`\``;

        require('../fix_file.js');

        const fsMock = require('fs');

        expect(fsMock.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fsMock.writeFileSync).toHaveBeenCalledWith('main.js', expect.any(String), 'utf8');

        expect(mockContent).toContain("const crypto = require('crypto');");
        expect(mockContent).toContain('crypto.randomInt(10000)');
        expect(mockContent).toContain('(crypto.randomBytes(4).readUInt32LE() / 0xffffffff)');

        expect(mockContent).not.toContain('Looking at the error');
        expect(mockContent).not.toContain('\`\`\`javascript');

        expect(mockContent).toContain("  } catch (error) {\n    logging.log('error', `Failed to monitor stargazers: ${" + "error.message}`);\n    throw error;\n  }\n}");

        expect(mockContent).toContain('module.exports = {');
        expect(mockContent).toContain('getTaskById,');
    });

    it('should replace addTask implementation', () => {
        mockContent = `const addTask = (title, priority = 'medium', tags = []) => {
  // Stub implementation: returns a mock task ID
  return crypto.randomInt(10000);
};`;

        require('../fix_file.js');

        expect(mockContent).toContain('taskIdCounter++;');
        expect(mockContent).toContain('tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });');
        expect(mockContent).toContain('return taskIdCounter;');
    });

    it('should not add crypto require if already present', () => {
        mockContent = `const crypto = require('crypto');\nconst a = Math.random();`;

        require('../fix_file.js');

        // Count occurrences of "const crypto = require('crypto');"
        const count = (mockContent.match(/const crypto = require\('crypto'\);/g) || []).length;
        expect(count).toBe(1);
    });

    it('should not add exports if already present', () => {
        mockContent = `module.exports = {\n  a: 1\n};\n`;

        require('../fix_file.js');

        // It shouldn't contain the exportsToAdd block again
        expect(mockContent).not.toContain('// Task Manager implementations for tests');
    });
});
