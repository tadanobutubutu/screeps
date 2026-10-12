describe('fix_file.js', () => {
  let fsMock;

  beforeEach(() => {
    jest.resetModules();
    fsMock = {
      readFileSync: jest.fn(),
      writeFileSync: jest.fn()
    };
    jest.doMock('fs', () => fsMock);
  });

  it('should remove markdown wrapper and add crypto require if missing', () => {
    const inputContent = `Looking at the error\n\`\`\`javascript\nconst foo = "bar";\n\`\`\``;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    expect(fsMock.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    expect(filename).toBe('main.js');
    expect(content).toContain('const crypto = require(\'crypto\');\nconst foo = "bar";');
    expect(content).not.toContain('Looking at the error');
    expect(content).not.toContain('\`\`\`');
  });

  it('should replace Math.random occurrences with crypto equivalents', () => {
    const inputContent = `const val1 = Math.floor(Math.random() * 10000);\nconst val2 = Math.random();`;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    expect(content).toContain('const val1 = crypto.randomInt(10000);');
    expect(content).toContain('const val2 = (crypto.randomBytes(4).readUInt32LE() / 0xffffffff);');
  });

  it('should fix the cutoff catch block', () => {
    const inputContent = `  } catch (error) {\n    logging.log('`;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    expect(content).toContain("  } catch (error) {\n    logging.log('error', `Failed to monitor stargazers: ${error.message}`);\n    throw error;\n  }\n}");
  });

  it('should add module.exports if not present', () => {
    const inputContent = `const a = 1;`;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    expect(content).toContain('module.exports = {');
    expect(content).toContain('getTasksSortedAlphabetically');
  });

  it('should not add module.exports if already present', () => {
    const inputContent = `module.exports = { a: 1 };`;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    const occurrences = (content.match(/module\.exports = \{/g) || []).length;
    expect(occurrences).toBe(1);
  });

  it('should replace the stub addTask implementation', () => {
    const inputContent = `const addTask = (title, priority = 'medium', tags = []) => {\n  // Stub implementation: returns a mock task ID\n  return crypto.randomInt(10000);\n};`;
    fsMock.readFileSync.mockReturnValue(inputContent);

    require('../fix_file.js');

    const [filename, content] = fsMock.writeFileSync.mock.calls[0];
    expect(content).toContain('taskIdCounter++;');
    expect(content).toContain('tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });');
  });
});
