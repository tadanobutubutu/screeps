jest.mock('child_process', () => ({
    execFileSync: jest.fn(),
}));

describe('format_everything.js', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('executes prettier and eslint successfully', () => {
        const child_process = require('child_process');
        child_process.execFileSync = jest.fn();

        jest.doMock('child_process', () => child_process);

        require('../format_everything.js');

        expect(child_process.execFileSync).toHaveBeenCalledWith(
            'npx', ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'], expect.any(Object)
        );
        expect(child_process.execFileSync).toHaveBeenCalledWith(
            'npx', ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'], expect.any(Object)
        );
    });

    it('catches and ignores errors from execFileSync', () => {
        const child_process = require('child_process');
        child_process.execFileSync = jest.fn().mockImplementation(() => {
            throw new Error('Mock error');
        });

        jest.doMock('child_process', () => child_process);

        expect(() => {
            require('../format_everything.js');
        }).not.toThrow();

        expect(child_process.execFileSync).toHaveBeenCalledWith(
            'npx', ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'], expect.any(Object)
        );
        expect(child_process.execFileSync).toHaveBeenCalledWith(
            'npx', ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'], expect.any(Object)
        );
    });
});
