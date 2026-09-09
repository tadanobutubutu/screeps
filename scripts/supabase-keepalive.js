// supabase-keepalive.js
// Supabase プロジェクトの自動停止（7日間非アクティブ）を防ぐためのスクリプト
//
// 事前に Supabase ダッシュボードで以下のテーブルを作成しておくこと:
// CREATE TABLE IF NOT EXISTS keepalive_log (
//   id INTEGER PRIMARY KEY,
//   pinged_at TIMESTAMPTZ,
//   source TEXT
// );

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function sanitizeErrorMessage(msg) {
    if (typeof msg !== 'string') return msg;
    const keys = ['key', 'token', 'secret', 'pass', 'auth', 'credential', 'bearer'].join('|');
    const pattern = new RegExp(
        '\\b([a-zA-Z0-9_-]*(' + keys + ')[a-zA-Z0-9_-]*)\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\']*\')|((?:Bearer\\s+)?[^ \\n\\t"\' ]+))',
        'gi'
    );
    return msg.replace(pattern, (match, p1, p2, p3, p4, p5, p6) => {
        const quote = p4 || p5;
        if (quote) {
            return p1 + p3 + quote[0] + '[REDACTED]' + quote[quote.length - 1];
        }
        return p1 + p3 + '[REDACTED]';
    });
}

async function keepAlive() {
    console.log(`[${new Date().toISOString()}] Supabase KeepAlive ping 開始...`);

    const { data, error } = await supabase.from('keepalive_log').upsert({
        id: 1,
        pinged_at: new Date().toISOString(),
        source: 'github-actions',
    });

    if (error) {
        const safeMsg = sanitizeErrorMessage(error.message);
        console.error('ERROR: Supabase への ping に失敗しました:', safeMsg);
        process.exit(1);
    }

    console.log('SUCCESS: Supabase への ping が成功しました');

    // 安全なフィールドのみを抽出してログに出力
    const safeData = Array.isArray(data)
        ? data.map((item) => ({
              id: item.id,
              pinged_at: item.pinged_at,
              source: item.source,
          }))
        : data
          ? {
                id: data.id,
                pinged_at: data.pinged_at,
                source: data.source,
            }
          : null;
    console.log('データ:', JSON.stringify(safeData));
}

if (require.main === module) {
    keepAlive();
}

module.exports = { keepAlive, sanitizeErrorMessage };
