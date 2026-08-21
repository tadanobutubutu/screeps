const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

jest.mock('child_process', () => ({
    execSync: jest.fn(),
    execFileSync: jest.fn()
}));
jest.mock('fs');
jest.mock('https', () => ({
    request: jest.fn()
}));

describe('add-contributor', () => {
    let script;
    let originalEnv;
    let mockRequest;

    beforeEach(() => {
        jest.resetModules();
        originalEnv = { ...process.env };

        process.env.GITHUB_TOKEN = 'test-token';
        process.env.ISSUE_AUTHOR = 'testuser';
        process.env.GITHUB_REPOSITORY = 'test/repo';

        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Ensure mocks are cleared between runs
        require('child_process').execSync.mockClear();
        require('child_process').execFileSync.mockClear();
        require('fs').existsSync.mockClear();
        require('fs').readFileSync.mockClear();
        require('fs').writeFileSync.mockClear();

        mockRequest = {
            on: jest.fn(),
            write: jest.fn(),
            end: jest.fn()
        };
        require('https').request.mockClear();
        require('https').request.mockReturnValue(mockRequest);

        script = require('../scripts/add-contributor.js');
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    describe('githubRequest', () => {
        it('should make a successful API request', async () => {
            const promise = script.githubRequest('/test');

            const requestCall = require('https').request.mock.calls[0];
            expect(requestCall[0]).toBe('https://api.github.com/test');
            expect(requestCall[1]).toEqual({
                method: 'GET',
                headers: {
                    Authorization: 'token test-token',
                    Accept: 'application/vnd.github+json'
                }
            });

            const callback = requestCall[2];
            const mockResponse = {
                statusCode: 200,
                on: jest.fn((event, cb) => {
                    if (event === 'data') cb(JSON.stringify({ id: 1 }));
                    if (event === 'end') cb();
                })
            };
            callback(mockResponse);

            const result = await promise;
            expect(result).toEqual({ id: 1 });
        });

        it('should throw an error on API failure', async () => {
            const promise = script.githubRequest('/test');

            const requestCall = require('https').request.mock.calls[0];
            const callback = requestCall[2];
            const mockResponse = {
                statusCode: 404,
                on: jest.fn((event, cb) => {
                    if (event === 'data') cb(JSON.stringify({ message: 'Not Found' }));
                    if (event === 'end') cb();
                })
            };
            callback(mockResponse);

            await expect(promise).rejects.toThrow('GitHub API error: 404 {"message":"Not Found"}');
        });
    });

    describe('getUserInfo', () => {
        it('should fetch user info', async () => {
            const mockUser = { login: 'testuser', name: 'Test User' };
            const promise = script.getUserInfo('testuser');

            const requestCall = require('https').request.mock.calls[0];
            expect(requestCall[0]).toBe('https://api.github.com/users/testuser');

            const callback = requestCall[2];
            const mockResponse = {
                statusCode: 200,
                on: jest.fn((event, cb) => {
                    if (event === 'data') cb(JSON.stringify(mockUser));
                    if (event === 'end') cb();
                })
            };
            callback(mockResponse);

            const result = await promise;
            expect(result).toEqual(mockUser);
        });
    });

    describe('getAllContributorsConfig', () => {
        it('should return null if file does not exist', () => {
            require('fs').existsSync.mockReturnValue(false);
            const result = script.getAllContributorsConfig();
            expect(result).toBeNull();
            expect(console.warn).toHaveBeenCalledWith('⚠️  .all-contributorsrc not found');
        });

        it('should return parsed JSON if file exists', () => {
            require('fs').existsSync.mockReturnValue(true);
            require('fs').readFileSync.mockReturnValue('{"projectName": "test"}');
            const result = script.getAllContributorsConfig();
            expect(result).toEqual({ projectName: 'test' });
        });
    });

    describe('isAlreadyContributor', () => {
        it('should return false if config is null or lacks contributors', () => {
            expect(script.isAlreadyContributor(null, 'testuser')).toBe(false);
            expect(script.isAlreadyContributor({}, 'testuser')).toBe(false);
        });

        it('should return true if user is already a contributor', () => {
            const config = { contributors: [{ login: 'otheruser' }, { login: 'testuser' }] };
            expect(script.isAlreadyContributor(config, 'testuser')).toBe(true);
        });

        it('should return false if user is not a contributor', () => {
            const config = { contributors: [{ login: 'otheruser' }] };
            expect(script.isAlreadyContributor(config, 'testuser')).toBe(false);
        });
    });

    describe('addContributorToConfig', () => {
        it('should add user to config', () => {
            const config = { contributors: [] };
            const user = { login: 'testuser', name: 'Test User', avatar_url: 'url', html_url: 'html' };
            const result = script.addContributorToConfig(config, user);

            expect(result.contributors).toHaveLength(1);
            expect(result.contributors[0]).toEqual({
                login: 'testuser',
                name: 'Test User',
                avatar_url: 'url',
                profile: 'html',
                contributions: ['bug']
            });
        });

        it('should use login as name if name is not provided', () => {
            const config = {};
            const user = { login: 'testuser', avatar_url: 'url', html_url: 'html' };
            const result = script.addContributorToConfig(config, user);

            expect(result.contributors[0].name).toBe('testuser');
        });
    });

    describe('updateAllContributorsConfig', () => {
        it('should write config to file', () => {
            const config = { contributors: [] };
            script.updateAllContributorsConfig(config);

            expect(require('fs').writeFileSync).toHaveBeenCalledWith(
                expect.stringContaining('.all-contributorsrc'),
                JSON.stringify(config, null, 2) + '\n'
            );
            expect(console.log).toHaveBeenCalledWith('✅ Updated .all-contributorsrc');
        });
    });

    describe('updateReadme', () => {
        it('should run all-contributors-cli', () => {
            script.updateReadme();
            expect(require('child_process').execSync).toHaveBeenCalledWith('npx all-contributors-cli generate', { stdio: 'inherit' });
            expect(console.log).toHaveBeenCalledWith('✅ README updated');
        });

        it('should log warning on failure', () => {
            require('child_process').execSync.mockImplementation(() => { throw new Error('CLI failed'); });
            script.updateReadme();
            expect(console.warn).toHaveBeenCalledWith('⚠️  Failed to update README:', 'CLI failed');
        });
    });

    describe('commitAndPush', () => {
        it('should run git commands', () => {
            script.commitAndPush('testuser');

            expect(require('child_process').execFileSync).toHaveBeenCalledWith('git', ['add', '.all-contributorsrc', 'README.md'], { stdio: 'inherit' });
            expect(require('child_process').execFileSync).toHaveBeenCalledWith('git', ['commit', '-m', 'docs: add testuser as a contributor'], { stdio: 'inherit' });
            expect(require('child_process').execFileSync).toHaveBeenCalledWith('git', ['push', 'origin', 'HEAD'], { stdio: 'inherit' });
            expect(console.log).toHaveBeenCalledWith('✅ Changes pushed');
        });

        it('should log warning on failure', () => {
            require('child_process').execFileSync.mockImplementation(() => { throw new Error('Git failed'); });
            script.commitAndPush('testuser');
            expect(console.warn).toHaveBeenCalledWith('⚠️  Failed to commit/push:', 'Git failed');
        });
    });

    describe('main', () => {
        it('should warn and exit if environment variables are missing', async () => {
            delete process.env.ISSUE_AUTHOR;
            await script.main();
            expect(console.warn).toHaveBeenCalledWith('⚠️  Missing ISSUE_AUTHOR or GITHUB_TOKEN');
        });

        it('should skip if no .all-contributorsrc', async () => {
            require('fs').existsSync.mockReturnValue(false);
            await script.main();
            expect(console.log).toHaveBeenCalledWith('ℹ️  Skipping contributor addition (no .all-contributorsrc)');
        });

        it('should skip if user is already a contributor', async () => {
            require('fs').existsSync.mockReturnValue(true);
            require('fs').readFileSync.mockReturnValue(JSON.stringify({ contributors: [{ login: 'testuser' }] }));

            await script.main();
            expect(console.log).toHaveBeenCalledWith('ℹ️  testuser is already a contributor');
        });

        it('should add contributor, update config, and commit', async () => {
            require('fs').existsSync.mockReturnValue(true);
            require('fs').readFileSync.mockReturnValue(JSON.stringify({ contributors: [] }));

            const promise = script.main();

            await new Promise(resolve => setTimeout(resolve, 0));

            const requestCall = require('https').request.mock.calls[0];
            const callback = requestCall[2];
            const mockResponse = {
                statusCode: 200,
                on: jest.fn((event, cb) => {
                    if (event === 'data') cb(JSON.stringify({ login: 'testuser', name: 'Test User' }));
                    if (event === 'end') cb();
                })
            };
            callback(mockResponse);

            await promise;

            expect(require('https').request).toHaveBeenCalled();
            expect(require('fs').writeFileSync).toHaveBeenCalled();
            expect(require('child_process').execSync).toHaveBeenCalled();
            expect(require('child_process').execFileSync).toHaveBeenCalledTimes(3);
            expect(console.log).toHaveBeenCalledWith('✅ testuser added as a contributor!');
        });

        it('should exit process with 1 on error', async () => {
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

            require('fs').existsSync.mockReturnValue(true);
            require('fs').readFileSync.mockReturnValue(JSON.stringify({ contributors: [] }));

            const promise = script.main();

            await new Promise(resolve => setTimeout(resolve, 0));

            const errorCall = mockRequest.on.mock.calls.find(call => call[0] === 'error');
            errorCall[1](new Error('Network error'));

            await promise;

            expect(console.error).toHaveBeenCalledWith('❌ Error:', 'Network error');
            expect(mockExit).toHaveBeenCalledWith(1);
        });
    });
});
