const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing repository...');

// ワークフローファイルを取得
const workflowDir = '.github/workflows';
const workflowFiles = fs
    .readdirSync(workflowDir)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map((f) => {
        try {
            const content = fs.readFileSync(path.join(workflowDir, f), 'utf8');
            const nameMatch = content.match(/name:\s*(.+)/);
            const scheduleMatch = content.match(/cron:\s*'([^']+)'/);
            return {
                file: f,
                name: nameMatch ? nameMatch[1].trim().replace(/^['"]|['"]$/g, '') : f,
                hasSchedule: !!scheduleMatch,
                schedule: scheduleMatch ? scheduleMatch[1] : null,
            };
        } catch (e) {
            return {
                file: f,
                name: f,
                hasSchedule: false,
                schedule: null,
            };
        }
    });

console.log(`✅ Found ${workflowFiles.length} workflows`);

// ロールファイルを取得
const roleFiles = fs
    .readdirSync('.')
    .filter((f) => f.startsWith('role.') && f.endsWith('.js'))
    .map((f) => f.replace('role.', '').replace('.js', ''));

console.log(`✅ Found ${roleFiles.length} role files`);

// JSファイルを取得（統計用）
const jsFiles = fs
    .readdirSync('.')
    .filter((f) => f.endsWith('.js') && !f.startsWith('node_modules'));

const totalLines = jsFiles.reduce((sum, file) => {
    const content = fs.readFileSync(file, 'utf8');
    return sum + content.split('\n').length;
}, 0);

console.log(`✅ Total ${jsFiles.length} JS files with ${totalLines} lines`);

// README.md を更新
const readme = `# 🎮 Screeps AI - 完全自動化リポジトリ

> Screeps AI code repository with **full automation** - no API keys required!

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![Workflows](https://img.shields.io/badge/Workflows-${workflowFiles.length}-green)](.github/workflows)
[![Roles](https://img.shields.io/badge/Roles-${roleFiles.length}-orange)](./)
[![Lines](https://img.shields.io/badge/Lines-${totalLines}-purple)](./)

## 🚀 特徴

- ✅ **API不要**: 外部APIキー不要で完全無料
- 🤖 **完全自動化**: 放置で自動改善・拡張
- 📊 **リアルタイム監視**: ゲーム状況をGitHubで確認
- 🆕 **自動拡張**: 新しいロールが週次で追加

## 📊 ゲーム状況

**現在の状況を確認**: [\`GAME_STATUS.md\`](./GAME_STATUS.md)

毎時自動更新されるリアルタイムレポート：
- 👤 プレイヤー情報 (GCL, CPU, Credits)
- 🏰 所有部屋の状況
- 🐛 クリープ統計
- 💾 メモリ使用率

## 🤖 自動化システム

### 📋 稼働中のワークフロー (${workflowFiles.length}個)

${workflowFiles.map((wf) => `- **${wf.name}** (\`${wf.file}\`)${wf.hasSchedule ? ` - 定期実行` : ` - イベント駆動`}`).join('\n')}

詳しくは [\`WORKFLOWS.md\`](./WORKFLOWS.md) を参照してください。

## 🐛 実装済みロール (${roleFiles.length}個)

${roleFiles.map((role, i) => `${i + 1}. **${role}** - \`role.${role}.js\``).join('\n')}

## 📈 統計情報

- 📄 **JSファイル数**: ${jsFiles.length}
- 📝 **総コード行数**: ${totalLines}
- 🔄 **ワークフロー数**: ${workflowFiles.length}
- 🎭 **ロール数**: ${roleFiles.length}

*最終更新: ${new Date().toISOString().split('T')[0]}*

## 🔧 セットアップ

### 1. Steam版購入後

1. Screeps公式サイトでログイン
2. Account Settings → API Access でトークン生成
3. GitHubリポジトリ Settings → Secrets で \`SCREEPS_TOKEN\` に設定
4. mainブランチにpushすれば自動デプロイ開始

### 2. ローカル開発 (オプション)

\`\`\`bash
git clone https://github.com/tadanobutubutu/screeps.git
cd screeps
npm install
\`\`\`

## 📁 ファイル構成

\`\`\`
.
├── .github/workflows/     # 自動化ワークフロー (${workflowFiles.length}個)
├── role.*.js              # クリープロール (${roleFiles.length}個)
├── utils.*.js             # ユーティリティ関数
├── main.js                # メインループ
├── deploy.js              # デプロイスクリプト
├── GAME_STATUS.md         # リアルタイムゲーム状況
├── WORKFLOWS.md           # ワークフロー詳細説明
└── game-history/          # 日付別履歴
\`\`\`

## 📚 ドキュメント

- [\`WORKFLOWS.md\`](./WORKFLOWS.md) - 自動化ワークフローの詳細
- [\`GAME_STATUS.md\`](./GAME_STATUS.md) - リアルタイムゲーム状況
- [\`META-CHANGELOG.md\`](./META-CHANGELOG.md) - システム変更履歴
- [\`SECURITY.md\`](./SECURITY.md) - セキュリティポリシー

## ✨ 主な機能

### 🔧 ルールベース自動改善

- \`console.log\` の削除
- \`var\` を \`const\` に変更
- 非効率なループの最適化
- メモリクリーンアップの自動追加

### 🎲 ランダム実験

毎週以下のいずれかを自動追加：
- 📊 パフォーマンスモニター
- 🧭 パスファインディングキャッシュ
- 🎯 スマートスポーン優先度
- 🛡️ タワー最適化
- ⚡ エネルギー効率トラッキング

### 🆕 自動ロール作成

毎週新しいロールを自動生成して \`main.js\` に統合します。

## 👨‍💻 貢献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your fully automated Screeps experience!** 🎮🤖

*このREADMEは自動更新されます - 最終更新: ${new Date().toISOString()}*
`;

fs.writeFileSync('README.md', readme);
console.log('✅ README.md updated!');

// WORKFLOWS.mdのヘッダーを更新
if (fs.existsSync('WORKFLOWS.md')) {
    let workflows = fs.readFileSync('WORKFLOWS.md', 'utf8');

    // 統計情報を挿入
    const statsSection = `\n> 📊 **統計**: ${workflowFiles.length}個 of workflows | 最終更新: ${new Date().toISOString().split('T')[0]}\n\n`;

    if (!workflows.includes('📊 **統計**')) {
        workflows = workflows.replace('# 🤖', `# 🤖${statsSection}`);
        fs.writeFileSync('WORKFLOWS.md', workflows);
        console.log('✅ WORKFLOWS.md updated!');
    }
}

// 統計ファイル作成
const stats = {
    updated: new Date().toISOString(),
    workflows: workflowFiles.length,
    roles: roleFiles.length,
    jsFiles: jsFiles.length,
    totalLines: totalLines,
    workflowList: workflowFiles.map((wf) => ({
        name: wf.name,
        file: wf.file,
        scheduled: wf.hasSchedule,
    })),
    roleList: roleFiles,
};

fs.writeFileSync('repo-stats.json', JSON.stringify(stats, null, 2));
console.log('✅ repo-stats.json created!');

console.log('\n📈 Summary:');
console.log(`  Workflows: ${workflowFiles.length}`);
console.log(`  Roles: ${roleFiles.length}`);
console.log(`  JS Files: ${jsFiles.length}`);
console.log(`  Total Lines: ${totalLines}`);
