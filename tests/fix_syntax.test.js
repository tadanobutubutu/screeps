let mockFileContent = '';
let writtenContent = '';
let writtenFile = '';

jest.mock('fs', () => ({
  readFileSync: jest.fn((path, enc) => {
    return mockFileContent;
  }),
  writeFileSync: jest.fn((path, content, enc) => {
    writtenFile = path;
    writtenContent = content;
  })
}));

describe('fix_syntax.js', () => {
  beforeEach(() => {
    jest.resetModules();
    mockFileContent = '';
    writtenContent = '';
    writtenFile = '';
  });

  it('should remove markdown block and find last brace', () => {
    mockFileContent = 'Some text\n```javascript\nconst a = { x: 1 };\nconsole.log(a);\n';
    require('../fix_syntax');
    expect(writtenFile).toBe('main.js.fixed');
    expect(writtenContent).toBe('const a = { x: 1 }');
  });

  it('should trim when no closing brace is found', () => {
    mockFileContent = 'Some text\n```javascript\nconst a = 1;\n';
    require('../fix_syntax');
    expect(writtenFile).toBe('main.js.fixed');
    expect(writtenContent).toBe('const a = 1;');
  });

  it('should handle no markdown block and find last brace', () => {
    mockFileContent = 'const b = { y: 2 };\n// some extra text';
    require('../fix_syntax');
    expect(writtenFile).toBe('main.js.fixed');
    expect(writtenContent).toBe('const b = { y: 2 }');
  });
});
