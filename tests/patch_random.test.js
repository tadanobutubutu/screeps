const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();

jest.mock('fs', () => ({
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync
}));

describe('patch_random.js', () => {
    beforeEach(() => {
        jest.resetModules();
        mockReadFileSync.mockClear();
        mockWriteFileSync.mockClear();
    });

    it('should read visual.effects.js, replace the string, and write back', () => {
        const originalContent = 'function rand() {\nreturn secureRandomFloat();\n}';
        const expectedContent = 'function rand() {\nreturn Math.random();\n}';

        mockReadFileSync.mockReturnValue(originalContent);

        require('../patch_random.js');

        expect(mockReadFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(mockWriteFileSync).toHaveBeenCalledWith('visual.effects.js', expectedContent);
    });

    it('should not modify content if the string to replace is not found', () => {
        const originalContent = 'function rand() {\nreturn Math.random();\n}';
        mockReadFileSync.mockReturnValue(originalContent);

        require('../patch_random.js');

        expect(mockReadFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(mockWriteFileSync).toHaveBeenCalledWith('visual.effects.js', originalContent);
    });
});
