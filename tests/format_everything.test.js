jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));

describe('format_everything.js', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('executes prettier and eslint successfully', () => {
        const child_process = require('child_process');
        child_process.execSync = jest.fn();

        jest.doMock('child_process', () => child_process);

        require('../format_everything.js');

        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('prettier --write'),
            expect.any(Object)
        );
        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('eslint'),
            expect.any(Object)
        );
    });

    it('catches and ignores errors from prettier execSync', () => {
        const child_process = require('child_process');
        child_process.execSync = jest.fn()
            .mockImplementationOnce(() => {
                throw new Error('Mock prettier error');
            })
            .mockImplementationOnce(() => {});

        jest.doMock('child_process', () => child_process);

        expect(() => {
            require('../format_everything.js');
        }).not.toThrow();

        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('prettier --write'),
            expect.any(Object)
        );
        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('eslint'),
            expect.any(Object)
        );
    });

    it('catches and ignores errors from eslint execSync', () => {
        const child_process = require('child_process');
        child_process.execSync = jest.fn()
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {
                throw new Error('Mock eslint error');
            });

        jest.doMock('child_process', () => child_process);

        expect(() => {
            require('../format_everything.js');
        }).not.toThrow();

        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('prettier --write'),
            expect.any(Object)
        );
        expect(child_process.execSync).toHaveBeenCalledWith(
            expect.stringContaining('eslint'),
            expect.any(Object)
        );
    });
});
