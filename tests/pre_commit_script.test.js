const mockExecFileSync = jest.fn();

jest.mock('child_process', () => ({
    execFileSync: mockExecFileSync
}));

describe('pre_commit_script.js', () => {
    let originalConsoleError;
    let originalProcessExit;

    beforeEach(() => {
        jest.resetModules();
        mockExecFileSync.mockClear();
        originalConsoleError = console.error;
        originalProcessExit = process.exit;

        console.error = jest.fn();
        process.exit = jest.fn().mockImplementation(code => {
            throw new Error(`exit ${code}`);
        });
    });

    afterEach(() => {
        console.error = originalConsoleError;
        process.exit = originalProcessExit;
    });

    it('should successfully execute lint and test commands', () => {
        require('../pre_commit_script.js');

        expect(mockExecFileSync).toHaveBeenCalledWith('npm', ['run', 'lint'], { stdio: 'inherit' });
        expect(mockExecFileSync).toHaveBeenCalledWith('npm', ['test'], { stdio: 'inherit' });
        expect(console.error).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
    });

    it('should handle execution errors and exit with code 1', () => {
        mockExecFileSync.mockImplementation(() => {
            throw new Error('Command failed');
        });

        expect(() => {
            require('../pre_commit_script.js');
        }).toThrow('exit 1');

        expect(console.error).toHaveBeenCalledWith('Pre-commit checks failed:', 'Command failed');
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
