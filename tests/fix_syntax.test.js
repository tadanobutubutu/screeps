describe('fix_syntax.js', () => {
    let fs;
    let replaceSpy;

    beforeEach(() => {
        jest.resetModules();
        jest.mock('fs');
        fs = require('fs');
        replaceSpy = jest.spyOn(String.prototype, 'replace');
    });

    afterEach(() => {
        replaceSpy.mockRestore();
        jest.clearAllMocks();
    });

    it('should read from main.js', () => {
        fs.readFileSync.mockReturnValue('mock content');
        require('../fix_syntax.js');
        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
    });

    it('should strip markdown before ```javascript', () => {
        fs.readFileSync.mockReturnValue('Some markdown\n```javascript\nconst obj = { a: 1 };');
        require('../fix_syntax.js');

        expect(replaceSpy).toHaveBeenCalledWith(/^[\s\S]*?```javascript\n/, '');
    });
});
