jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
}));

describe('patch_random.js', () => {
    let fs;

    beforeEach(() => {
        jest.resetModules();
        fs = require('fs');
        fs.readFileSync.mockClear();
        fs.writeFileSync.mockClear();
    });

    it('should read visual.effects.js, replace the string, and write back', () => {
        const originalContent = 'function rand() {\nreturn secureRandomFloat();\n}';
        const expectedContent = 'function rand() {\nreturn Math.random();\n}';

        fs.readFileSync.mockReturnValue(originalContent);

        require('../patch_random.js');

        expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', expectedContent);
    });

    it('should not modify content if the string to replace is not found', () => {
        const originalContent = 'function rand() {\nreturn Math.random();\n}';
        fs.readFileSync.mockReturnValue(originalContent);

        require('../patch_random.js');

        expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', originalContent);
    });
});
