jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
}));

describe('fix_syntax.js', () => {
    let fs;

    beforeEach(() => {
        jest.resetModules();
        fs = require('fs');
    });

    it('should strip markdown block prefix and keep everything up to the last closing brace', () => {
        fs.readFileSync.mockReturnValue('Some text\n```javascript\nfunction test() { return {}; }\nconsole.log(1);\n```\nmore text');

        require('../fix_syntax.js');

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'function test() { return {}; }', 'utf8');
    });

    it('should just trim if no closing brace is found', () => {
        fs.readFileSync.mockReturnValue('```javascript\nconst a = 1;  \n\n');

        require('../fix_syntax.js');

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'const a = 1;', 'utf8');
    });

    it('should handle file with no markdown blocks correctly but with a closing brace', () => {
        fs.readFileSync.mockReturnValue('const obj = { a: 1 };  \n  ');

        require('../fix_syntax.js');

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'const obj = { a: 1 }', 'utf8');
    });
});
