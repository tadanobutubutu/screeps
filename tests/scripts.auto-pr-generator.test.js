const child_process = require('child_process');
const fs = require('fs');

jest.mock('child_process', () => ({
    execFileSync: jest.fn(),
}));
jest.mock('fs');

describe('auto-pr-generator', () => {
    let originalEnv;
    let githubRequest,
        getSanitizedRepo,
        getIssueDetails,
        analyzeIssueWithClaude,
        createFixBranch,
        createPullRequest,
        main;

    beforeEach(() => {
        jest.clearAllMocks();
        originalEnv = { ...process.env };
        process.env.GITHUB_REPOSITORY = 'tadanobutubutu/screeps';
        process.env.ISSUE_NUMBER = '123';
        process.env.GITHUB_TOKEN = 'fake_token';
        process.env.ANTHROPIC_API_KEY = 'fake_key';

        jest.isolateModules(() => {
            const module = require('../scripts/auto-pr-generator.js');
            githubRequest = module.githubRequest;
            getSanitizedRepo = module.getSanitizedRepo;
            getIssueDetails = module.getIssueDetails;
            analyzeIssueWithClaude = module.analyzeIssueWithClaude;
            createFixBranch = module.createFixBranch;
            createPullRequest = module.createPullRequest;
            main = module.main;
        });

        global.fetch = jest.fn();

        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(process, 'exit').mockImplementation(() => {});
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
        delete global.fetch;
    });

    describe('getSanitizedRepo', () => {
        it('should return valid repo string', () => {
            process.env.GITHUB_REPOSITORY = 'valid-org/valid-repo';
            expect(getSanitizedRepo()).toBe('valid-org/valid-repo');
        });

        it('should throw error on invalid/malicious GITHUB_REPOSITORY', () => {
            process.env.GITHUB_REPOSITORY = '../malicious/repo';
            expect(() => getSanitizedRepo()).toThrow('Invalid GITHUB_REPOSITORY format');
        });
    });

    describe('githubRequest', () => {
        it('should make a request to github api and return json', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1 }),
            });

            const result = await githubRequest('/test', { method: 'POST', body: { foo: 'bar' } });

            expect(result).toEqual({ id: 1 });
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.github.com/test',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: 'token fake_token',
                    }),
                    body: JSON.stringify({ foo: 'bar' }),
                })
            );
        });

        it('should throw an error if response is not ok', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            await expect(githubRequest('/test')).rejects.toThrow('GitHub API error: 404 Not Found');
        });
    });

    describe('getIssueDetails', () => {
        it('should fetch issue details', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ number: 123, title: 'test issue' }),
            });

            const result = await getIssueDetails(123);
            expect(result).toEqual({ number: 123, title: 'test issue' });
        });
    });

    describe('analyzeIssueWithClaude', () => {
        it('should analyze issue and extract json', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [
                        {
                            text: 'some text {"rootCause": "test cause"} more text',
                        },
                    ],
                }),
            });

            const result = await analyzeIssueWithClaude({ title: 'test', body: 'body' });
            expect(result).toEqual({ rootCause: 'test cause' });

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.anthropic.com/v1/messages',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'x-api-key': 'fake_key',
                    }),
                })
            );
        });

        it('should throw if claude api fails', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(analyzeIssueWithClaude({ title: 't' })).rejects.toThrow(
                'Claude API error: 500'
            );
        });

        it('should throw if json cannot be extracted', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [
                        {
                            text: 'no json here',
                        },
                    ],
                }),
            });

            await expect(analyzeIssueWithClaude({ title: 't' })).rejects.toThrow(
                'Failed to extract JSON from Claude response'
            );
        });
    });

    describe('createFixBranch', () => {
        it('should create branch, write files, and commit', async () => {
            const issue = { number: 123, title: 'Test Issue' };
            const analysis = {
                rootCause: 'bug',
                suggestedFix: {
                    changes: [{ file: 'src/test.js', code: 'const a = 1;' }],
                },
            };

            fs.existsSync.mockReturnValueOnce(false); // for dir
            fs.existsSync.mockReturnValueOnce(true); // for file
            fs.readFileSync.mockReturnValueOnce('old code');

            const result = await createFixBranch(issue, analysis);

            expect(result.branchName).toBe('fix/issue-123-test-issue');
            expect(child_process.execFileSync).toHaveBeenCalledWith(
                'git',
                ['fetch', 'origin'],
                expect.any(Object)
            );
            expect(child_process.execFileSync).toHaveBeenCalledWith(
                'git',
                ['checkout', '-b', 'fix/issue-123-test-issue', 'origin/main'],
                expect.any(Object)
            );

            expect(fs.mkdirSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                expect.stringContaining('src/test.js'),
                'old code\n\nconst a = 1;'
            );

            expect(child_process.execFileSync).toHaveBeenCalledWith(
                'git',
                ['add', '-A'],
                expect.any(Object)
            );
            expect(child_process.execFileSync).toHaveBeenCalledWith(
                'git',
                ['commit', '-m', expect.stringContaining('fix(#123): Test Issue')],
                expect.any(Object)
            );
            expect(child_process.execFileSync).toHaveBeenCalledWith(
                'git',
                ['push', 'origin', 'fix/issue-123-test-issue'],
                expect.any(Object)
            );
        });

        it('should ignore path traversal attempts and not write files outside repository', async () => {
            const issue = { number: 123, title: 'Test Issue' };
            const analysis = {
                rootCause: 'bug',
                suggestedFix: {
                    changes: [
                        { file: '../../etc/passwd', code: 'malicious' },
                        { file: '/etc/shadow', code: 'malicious' },
                    ],
                },
            };

            await createFixBranch(issue, analysis);

            expect(fs.writeFileSync).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('Security Warning: Ignored path traversal attempt')
            );
        });

        it('should throw and not proceed if branch creation fails', async () => {
            child_process.execFileSync.mockImplementationOnce(() => {
                throw new Error('git fail');
            });

            await expect(
                createFixBranch({ number: 1, title: 't' }, { suggestedFix: { changes: [] } })
            ).rejects.toThrow('git fail');
        });
    });

    describe('createPullRequest', () => {
        it('should create a PR', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ html_url: 'http://pr', number: 42 }),
            });

            const result = await createPullRequest(
                { number: 123, title: 'Test' },
                {
                    severity: 'high',
                    rootCause: 'rc',
                    suggestedFix: { description: 'desc' },
                    testSuggestion: 'test',
                },
                { branchName: 'fix-branch' }
            );

            expect(result.html_url).toBe('http://pr');
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.github.com/repos/tadanobutubutu/screeps/pulls',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"head":"fix-branch"'),
                })
            );
        });
    });

    describe('main', () => {
        it('should exit with 1 if ISSUE_NUMBER is missing', async () => {
            delete process.env.ISSUE_NUMBER;
            jest.isolateModules(() => {
                main = require('../scripts/auto-pr-generator.js').main;
            });

            await main();
            expect(process.exit).toHaveBeenCalledWith(1);
            expect(console.error).toHaveBeenCalledWith(
                '❌ ISSUE_NUMBER environment variable is not set'
            );
        });

        it('should exit with 1 if GITHUB_TOKEN is missing', async () => {
            delete process.env.GITHUB_TOKEN;
            jest.isolateModules(() => {
                main = require('../scripts/auto-pr-generator.js').main;
            });

            await main();
            expect(process.exit).toHaveBeenCalledWith(1);
            expect(console.error).toHaveBeenCalledWith('❌ Missing required environment variables');
        });

        it('should process successfully', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ number: 123, title: 'test issue', body: 'body' }),
            });
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [
                        {
                            text: '{"rootCause":"rc","severity":"low","suggestedFix":{"changes":[]}}',
                        },
                    ],
                }),
            });
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ number: 42, html_url: 'pr_url' }),
            });

            child_process.execFileSync.mockImplementation(() => {});
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue('old');

            await main();

            expect(process.exit).toHaveBeenCalledWith(0);
        });

        it('should exit with 1 if an error occurs', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Test error'));

            await main();

            expect(console.error).toHaveBeenCalledWith('❌ Error:', 'Test error');
            expect(process.exit).toHaveBeenCalledWith(1);
        });
    });
});
