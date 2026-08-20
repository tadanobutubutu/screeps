const fs = require('fs');
const patchScript = require('../patch_random.js');

jest.mock('fs');

describe('patch_random.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should read visual.effects.js and replace secureRandomFloat with Math.random', () => {
        const initialContent = 'function random() {\nreturn secureRandomFloat();\n}';
        const expectedContent = 'function random() {\nreturn Math.random();\n}';

        fs.readFileSync.mockReturnValue(initialContent);

        patchScript();

        expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', expectedContent);
    });

    it('should not change content if secureRandomFloat is not present', () => {
        const initialContent = 'function random() {\nreturn Math.random();\n}';

        fs.readFileSync.mockReturnValue(initialContent);

        patchScript();

        expect(fs.readFileSync).toHaveBeenCalledWith('visual.effects.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('visual.effects.js', initialContent);
    });
});
