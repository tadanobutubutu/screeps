describe('fix_syntax.js', () => {
    let fs;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        jest.mock('fs');
        fs = require('fs');
    });

    it('should remove leading markdown and trailing characters after the last brace', () => {
        const mockCode = `
Some text
\`\`\`javascript
const a = {
    b: 1
};
Some other text after closing brace
        `;

        fs.readFileSync.mockReturnValue(mockCode);

        require('../fix_syntax');

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'const a = {\n    b: 1\n}', 'utf8');
    });

    it('should just trim if there is no closing brace', () => {
        const mockCode = `
\`\`\`javascript
const a = 1;
        `;

        fs.readFileSync.mockReturnValue(mockCode);

        require('../fix_syntax');

        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'const a = 1;', 'utf8');
    });

    it('should handle code without markdown and not truncate valid code', () => {
        const mockCode = `const a = { b: 1 };\nconsole.log(a);`;

        fs.readFileSync.mockReturnValue(mockCode);

        require('../fix_syntax');

        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js.fixed', 'const a = { b: 1 };\nconsole.log(a);', 'utf8');
    });
});
