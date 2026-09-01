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
});
