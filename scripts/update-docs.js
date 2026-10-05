const fs = require('fs')
const path = require('path')
const { writeFilesTransactionally } = require('./atomic-write')
const { createBadgeBlock, isValidMetric } = require('./readme-badges')

console.log('📊 Analyzing repository...')

const rootDir = process.cwd()
const workflowDir = path.join(rootDir, '.github', 'workflows')
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8')
const generatedAt = new Date()
const today = generatedAt.toISOString().slice(0, 10)
const now = generatedAt.toISOString()

const countLines = (content) => {
  if (content.length === 0) return 0
  const lines = content.split(/\r\n|\r|\n/)
  if (lines[lines.length - 1] === '') lines.pop()
  return lines.length
}
const extractWorkflowName = (content, fallback) => {
  const nameMatch = content.match(/^name:\s*(.+)$/m)
  return nameMatch ? nameMatch[1].trim().replace(/^['"]|['"]$/g, '') : fallback
}
const hasScheduledTrigger = (content) => /(^|\n)\s*schedule:\s*$/m.test(content)

// ワークフローファイルを取得
const workflowFiles = fs
  .readdirSync(workflowDir, { withFileTypes: true })
  .filter((entry) => entry.name.endsWith('.yml') || entry.name.endsWith('.yaml'))
  .map((entry) => {
    if (!entry.isFile()) {
      throw new Error(`Workflow entry is not a regular file: ${entry.name}`)
    }
    const safeName = path.basename(entry.name)
    if (safeName !== entry.name || safeName === '.' || safeName === '..') {
      throw new Error(`Workflow entry has an invalid filename: ${entry.name}`)
    }
    const content = readFile(`${workflowDir}${path.sep}${safeName}`)
    if (content.trim().length === 0) {
      throw new Error(`Workflow file is empty: ${entry.name}`)
    }
    return {
      file: entry.name,
      name: extractWorkflowName(content, entry.name),
      hasSchedule: hasScheduledTrigger(content),
    }
  })
  .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))

console.log(`✅ Found ${workflowFiles.length} workflows`)

// ロールファイルを取得
const roleFiles = fs
  .readdirSync(rootDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.startsWith('role.') && entry.name.endsWith('.js'))
  .map((entry) => entry.name.replace('role.', '').replace('.js', ''))
  .sort()

console.log(`✅ Found ${roleFiles.length} role files`)

// JSファイルを取得（統計用）
const jsFiles = fs
  .readdirSync(rootDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
  .map((entry) => entry.name)
  .sort()

const totalLines = jsFiles.reduce((sum, file) => {
  const content = readFile(file)
  return sum + countLines(content)
}, 0)

console.log(`✅ Total ${jsFiles.length} JS files with ${totalLines} lines`)

// 不正値では既存バッヂを流用せず、その項目のバッヂを出さない。
for (const [label, value] of [
  ['Workflow file count', workflowFiles.length],
  ['Role file count', roleFiles.length],
  ['Root JavaScript line count', totalLines],
]) {
  if (!isValidMetric(value)) {
    throw new Error(`${label} could not be verified; README and stats were not updated.`)
  }
}

let packageJsonText
let licenseText
try {
  packageJsonText = fs.readFileSync('package.json', 'utf8')
  licenseText = fs.readFileSync('LICENSE', 'utf8')
} catch {
  // Missing or unreadable license sources omit the MIT badge.
}

const badgeBlock = createBadgeBlock({
  rootDir,
  workflowFiles,
  roleFiles,
  totalLines,
  packageJsonText,
  licenseText,
})

// README.md を更新
const readme = `# 🎮 Screeps AI and Automation

> Screeps AI bot and supporting GitHub Actions automation.

${badgeBlock}

## 🚀 特徴

- 🤖 **自動化ワークフロー**: メンテナンス、デプロイ、レポートなどのタスクをGitHub Actionsで実行
- 🔑 **設定要件**: 外部サービスを使うワークフローでは必要なトークンやSecretsを設定
- 📊 **ゲーム状況の記録**: 状況レポートをリポジトリ上で確認
- 🆕 **ロール作成の提案**: スケジュール実行でロール作成Issueを作成

## 📊 ゲーム状況

**現在の状況を確認**: [\`GAME_STATUS.md\`](./GAME_STATUS.md)

毎時のスケジュール実行で更新を試みるゲーム状況レポート：
- 👤 プレイヤー情報 (GCL, CPU, Credits)
- 🏰 所有部屋の状況
- 🐛 クリープ統計
- 💾 メモリ使用率

## 🤖 自動化システム

### 📋 ワークフローファイル (${workflowFiles.length}個)

${workflowFiles.map((wf) => `- **${wf.name}** (\`${wf.file}\`)`).join('\n')}

詳しくは [\`WORKFLOWS.md\`](./WORKFLOWS.md) を参照してください。

## 🐛 ロールファイル (${roleFiles.length}個)

${roleFiles.map((role, i) => `${i + 1}. **${role}** - \`role.${role}.js\``).join('\n')}

## 📈 統計情報

- 📄 **ルート直下のJSファイル数**: ${jsFiles.length}
- 🔄 **ワークフローファイル数**: ${workflowFiles.length}
- 🎭 **ロールファイル数**: ${roleFiles.length}
- 📝 **ルート直下のJS行数**: ${totalLines}

*最終更新: ${today}*

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
├── GAME_STATUS.md         # ゲーム状況レポート
├── WORKFLOWS.md           # ワークフロー詳細説明
└── game-history/          # 日付別履歴
\`\`\`

## 📚 ドキュメント

- [\`WORKFLOWS.md\`](./WORKFLOWS.md) - 自動化ワークフローの詳細
- [\`GAME_STATUS.md\`](./GAME_STATUS.md) - ゲーム状況レポート
- [\`META-CHANGELOG.md\`](./META-CHANGELOG.md) - システム変更履歴
- [\`SECURITY.md\`](./SECURITY.md) - セキュリティポリシー

## ✨ 主な機能

### 🔧 ルールベース自動改善

- \`console.log\` の削除
- \`var\` を \`const\` に変更
- 非効率なループの最適化
- メモリクリーンアップの自動追加

### 🎲 ランダム実験

毎週、次の候補から1つを選び、同じ変更がまだない場合に \`main.js\` への追加を試みます：
- 📊 パフォーマンスモニター
- 🧭 パスファインディングキャッシュ
- 🎯 スマートスポーン優先度
- 🛡️ タワー最適化
- ⚡ エネルギー効率トラッキング

### 🆕 自動ロール作成

毎週、新しいロールの追加を提案するIssueを作成します（ロール自体の自動生成・統合ではありません）。

## 👨‍💻 貢献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your Screeps experience!** 🎮🤖

*このREADMEは生成スクリプトで更新されます - 最終更新: ${now}*
`

const generatedOutputs = { 'README.md': readme }

// WORKFLOWS.mdのヘッダーを更新（既存の内容は、追加変更が必要な場合だけ出力対象にする）
if (fs.existsSync(path.join(rootDir, 'WORKFLOWS.md'))) {
  let workflows = readFile('WORKFLOWS.md')

  // 統計情報を挿入
  const statsSection = `\n> 📊 **統計**: ${workflowFiles.length}個 of workflows | 最終更新: ${today}\n\n`

  if (!workflows.includes('📊 **統計**')) {
    workflows = workflows.replace('# 🤖', `# 🤖${statsSection}`)
    generatedOutputs['WORKFLOWS.md'] = workflows
  }
}

// 統計ファイル作成
const stats = {
  updated: now,
  workflows: workflowFiles.length,
  roles: roleFiles.length,
  jsFiles: jsFiles.length,
  totalLines,
  workflowList: workflowFiles.map((wf) => ({
    name: wf.name,
    file: wf.file,
    scheduled: wf.hasSchedule
  })),
  roleList: roleFiles
}

generatedOutputs['repo-stats.json'] = `${JSON.stringify(stats, null, 2)}\n`

// 全内容の読み込み・検証・生成後に一時領域へ書き、失敗時は以前のファイルを復元する。
writeFilesTransactionally(rootDir, generatedOutputs)
console.log('✅ README.md and repo-stats.json updated!')
if (Object.hasOwn(generatedOutputs, 'WORKFLOWS.md')) console.log('✅ WORKFLOWS.md updated!')

console.log('\n📈 Summary:')
console.log(`  Workflows: ${workflowFiles.length}`)
console.log(`  Roles: ${roleFiles.length}`)
console.log(`  JS Files: ${jsFiles.length}`)
console.log(`  Total Lines: ${totalLines}`)
