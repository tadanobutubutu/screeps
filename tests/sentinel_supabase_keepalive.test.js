// Mock process.env before requiring the script
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';

// Mock the supabase client
jest.mock(
    '@supabase/supabase-js',
    () => {
        return {
            createClient: jest.fn(() => ({
                from: jest.fn(() => ({
                    upsert: jest.fn().mockResolvedValue({
                        data: [
                            {
                                id: 1,
                                pinged_at: '2023-01-01T00:00:00.000Z',
                                source: 'github-actions',
                                sensitive_token: 'secret123',
                                password_hash: 'hash456',
                            },
                        ],
                        error: null,
                    }),
                })),
            })),
        };
    },
    { virtual: true }
);

describe('Supabase Keepalive Security Tests', () => {
    let originalConsoleLog;
    let consoleLogMock;

    beforeAll(() => {
        originalConsoleLog = console.log;
    });

    beforeEach(() => {
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogMock.mockRestore();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    it('should not log sensitive fields from the data object', async () => {
        // Require the script dynamically to ensure mocks are applied
        const { keepAlive } = require('../scripts/supabase-keepalive.js');

        await keepAlive();

        // Find the log call that outputs the data
        const dataLogCall = consoleLogMock.mock.calls.find((call) => call[0] === 'データ:');
        expect(dataLogCall).toBeDefined();

        const loggedDataString = dataLogCall[1];
        const loggedData = JSON.parse(loggedDataString);

        // Assert that the safe fields are present
        expect(loggedData[0]).toHaveProperty('id', 1);
        expect(loggedData[0]).toHaveProperty('pinged_at', '2023-01-01T00:00:00.000Z');
        expect(loggedData[0]).toHaveProperty('source', 'github-actions');

        // Assert that sensitive fields are NOT present
        expect(loggedData[0]).not.toHaveProperty('sensitive_token');
        expect(loggedData[0]).not.toHaveProperty('password_hash');
    });
});
