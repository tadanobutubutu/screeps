describe('fix_file.js', () => {
    let fs;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        jest.mock('fs');
        fs = require('fs');
    });

    it('should strip markdown wrapper', () => {
        fs.readFileSync.mockReturnValue('Looking at the error\n```javascript\nconst a = 1;\n```\n');
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1]).toContain('const a = 1;');
        expect(writeCall[1]).not.toContain('Looking at the error');
        expect(writeCall[1]).not.toContain('```javascript');
    });

    it('should add crypto require if missing and replace Math.random', () => {
        fs.readFileSync.mockReturnValue('const num = Math.floor(Math.random() * 10000);\nconst rand = Math.random();');
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1]).toContain("const crypto = require('crypto');");
        expect(writeCall[1]).toContain('crypto.randomInt(10000)');
        expect(writeCall[1]).toContain('(crypto.randomBytes(4).readUInt32LE() / 0xffffffff)');
    });

    it('should not add crypto require if already present', () => {
        fs.readFileSync.mockReturnValue("const crypto = require('crypto');\nconst a = 1;");
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1].split("const crypto = require('crypto');").length).toBe(2);
    });

    it('should fix the end of the file', () => {
        fs.readFileSync.mockReturnValue("  } catch (error) {\n    logging.log('");
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1]).toContain("  } catch (error) {\n    logging.log('error', `Failed to monitor stargazers: ${error.message}`);\n    throw error;\n  }\n}");
    });

    it('should add exports if missing', () => {
        fs.readFileSync.mockReturnValue("const a = 1;");
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1]).toContain("module.exports = {");
        expect(writeCall[1]).toContain("addTask,");
    });

    it('should not add exports if already present', () => {
        fs.readFileSync.mockReturnValue("module.exports = {\n  a: 1\n};");
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1].split("module.exports = {").length).toBe(2);
    });

    it('should replace addTask implementation', () => {
        fs.readFileSync.mockReturnValue("const addTask = (title, priority = 'medium', tags = []) => {\n  // Stub implementation: returns a mock task ID\n  return crypto.randomInt(10000);\n};");
        require('../fix_file.js');
        const writeCall = fs.writeFileSync.mock.calls[0];
        expect(writeCall[1]).toContain("taskIdCounter++;");
        expect(writeCall[1]).toContain("tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });");
    });
});
