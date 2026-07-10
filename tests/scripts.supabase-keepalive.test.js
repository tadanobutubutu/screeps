describe('scripts/supabase-keepalive.js', () => {
    let originalEnv;
    let mockExit;
    let mockConsoleError;
    let mockConsoleLog;
    let mockUpsert;

    beforeEach(() => {
        // 環境変数のバックアップと初期設定
        originalEnv = { ...process.env };
        process.env.SUPABASE_URL = 'http://localhost';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';

        // モックのセットアップ
        mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

        mockUpsert = jest.fn().mockResolvedValue({ data: null, error: null });

        // requireキャッシュをクリアして各テストでモジュールを再評価できるようにする
        jest.resetModules();

        // @supabase/supabase-js のモック
        jest.mock(
            '@supabase/supabase-js',
            () => ({
                createClient: jest.fn(() => ({
                    from: jest.fn(() => ({
                        upsert: mockUpsert,
                    })),
                })),
            }),
            { virtual: true }
        );
    });

    afterEach(() => {
        // 環境変数とモックを元に戻す
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    it('環境変数が不足している場合、エラーを出力して終了すること', () => {
        // 環境変数を削除
        delete process.env.SUPABASE_URL;

        // スクリプトをrequireするとトップレベルの検証が実行される
        require('../scripts/supabase-keepalive.js');

        expect(mockConsoleError).toHaveBeenCalledWith(
            'ERROR: SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません'
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('pingが成功し、dataが配列の場合、安全なフィールドのみをログに出力すること', async () => {
        const testData = [{ id: 1, pinged_at: '2023-01-01', source: 'test', secret: 'hidden' }];
        mockUpsert.mockResolvedValue({ data: testData, error: null });

        const { keepAlive } = require('../scripts/supabase-keepalive.js');
        await keepAlive();

        expect(mockConsoleLog).toHaveBeenCalledWith(
            expect.stringContaining('Supabase KeepAlive ping 開始...')
        );
        expect(mockConsoleLog).toHaveBeenCalledWith('SUCCESS: Supabase への ping が成功しました');

        const expectedSafeData = JSON.stringify([
            { id: 1, pinged_at: '2023-01-01', source: 'test' },
        ]);
        expect(mockConsoleLog).toHaveBeenCalledWith('データ:', expectedSafeData);
    });

    it('pingが成功し、dataがオブジェクトの場合、安全なフィールドのみをログに出力すること', async () => {
        const testData = { id: 2, pinged_at: '2023-01-02', source: 'test2', secret: 'hidden' };
        mockUpsert.mockResolvedValue({ data: testData, error: null });

        const { keepAlive } = require('../scripts/supabase-keepalive.js');
        await keepAlive();

        const expectedSafeData = JSON.stringify({
            id: 2,
            pinged_at: '2023-01-02',
            source: 'test2',
        });
        expect(mockConsoleLog).toHaveBeenCalledWith('データ:', expectedSafeData);
    });

    it('pingが成功し、dataがnullの場合、nullをログに出力すること', async () => {
        mockUpsert.mockResolvedValue({ data: null, error: null });

        const { keepAlive } = require('../scripts/supabase-keepalive.js');
        await keepAlive();

        expect(mockConsoleLog).toHaveBeenCalledWith('データ:', 'null');
    });

    it('pingに失敗した場合、エラーを出力して終了すること', async () => {
        mockUpsert.mockResolvedValue({ data: null, error: { message: 'DB connection error' } });

        const { keepAlive } = require('../scripts/supabase-keepalive.js');
        await keepAlive();

        expect(mockConsoleError).toHaveBeenCalledWith(
            'ERROR: Supabase への ping に失敗しました:',
            'DB connection error'
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
