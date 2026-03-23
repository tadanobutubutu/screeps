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

async function keepAlive() {
  console.log(`[${new Date().toISOString()}] Supabase KeepAlive ping 開始...`);

  const { data, error } = await supabase
    .from('keepalive_log')
    .upsert({
      id: 1,
      pinged_at: new Date().toISOString(),
      source: 'github-actions',
    });

  if (error) {
    console.error('ERROR: Supabase への ping に失敗しました:', error.message);
    process.exit(1);
  }

  console.log('SUCCESS: Supabase への ping が成功しました');
  console.log('データ:', JSON.stringify(data));
}

keepAlive();
