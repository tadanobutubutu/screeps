jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('patch_random.js', () => {
  let fs;

  beforeEach(() => {
    jest.resetModules();
    fs = require('fs');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should patch secureRandomFloat to Math.random', () => {
    fs.readFileSync.mockReturnValue('function test() {\n  return secureRandomFloat();\n}');
    require('../patch_random.js');
    expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', 'function test() {\n  return Math.random();\n}');
  });

  it('should correctly handle if string is not found', () => {
    fs.readFileSync.mockReturnValue('function test() {\n  return otherFunction();\n}');
    require('../patch_random.js');
    expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', 'function test() {\n  return otherFunction();\n}');
  });
});
