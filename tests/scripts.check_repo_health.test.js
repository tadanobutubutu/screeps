describe('check_repo_health', () => {
    let originalEnv;
    let getPkgManager;

    beforeEach(() => {
        originalEnv = { ...process.env };
        delete process.env.PKG_MANAGER;
        jest.isolateModules(() => {
            getPkgManager = require('../scripts/check_repo_health').getPkgManager;
        });
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should return allowed PKG_MANAGER from env if in allowlist', () => {
        ['npm', 'pnpm', 'yarn', 'bun'].forEach((mgr) => {
            process.env.PKG_MANAGER = mgr;
            expect(getPkgManager()).toBe(mgr);
        });
    });

    it('should ignore unsafe/invalid PKG_MANAGER and fallback to valid manager', () => {
        process.env.PKG_MANAGER = 'pnpm; malicious_command';
        expect(['npm', 'pnpm']).toContain(getPkgManager());
    });

    it('should fallback to npm or pnpm when PKG_MANAGER is unset', () => {
        delete process.env.PKG_MANAGER;
        expect(['npm', 'pnpm']).toContain(getPkgManager());
    });

    describe('checkEslint & checkJest safe execution', () => {
        it('runCommand should execute execFileSync when args array is passed', () => {
            const childProcess = require('child_process');
            const spy = jest.spyOn(childProcess, 'execFileSync').mockImplementation(() => {});

            let runCommand;
            jest.isolateModules(() => {
                runCommand = require('../scripts/check_repo_health').runCommand;
            });

            const result = runCommand('npx', ['eslint', '.']);

            expect(result.ok).toBe(true);
            expect(spy).toHaveBeenCalledWith('npx', ['eslint', '.'], expect.any(Object));
            spy.mockRestore();
        });
    });
});
