#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub API
const GITHUB_API = 'https://api.github.com';
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;

function getSanitizedRepo() {
    const rawRepo = process.env.GITHUB_REPOSITORY || 'tadanobutubutu/screeps';
    if (typeof rawRepo !== 'string' || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(rawRepo)) {
        throw new Error(`Invalid GITHUB_REPOSITORY format: ${rawRepo}`);
    }
    return rawRepo;
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * GitHub API リクエスト実行
 */
async function githubRequest(endpoint, options = {}) {
    const url = `${GITHUB_API}${endpoint}`;
    const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        ...options.headers,
    };

    const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Issue の詳細情報を取得
 */
async function getIssueDetails(issueNumber) {
    console.log(`📋 Fetching issue #${issueNumber}...`);
    const repo = getSanitizedRepo();
    const issue = await githubRequest(`/repos/${repo}/issues/${issueNumber}`);
    return issue;
}

/**
 * Claude API で Issue を分析し、修正コードを生成
 */
/**
 * Claudeに送るプロンプトを構築する
 */
function _buildClaudePrompt(issue) {
    return `You are an expert software engineer. Analyze the following GitHub issue and provide:
1. Root cause analysis
2. Specific code changes needed (with file paths)
3. A concise implementation plan

Issue Title: ${issue.title}
Issue Body:
${issue.body}

Please respond in JSON format:
{
  "rootCause": "analysis of the root cause",
  "severity": "critical|high|medium|low",
  "affectedFiles": ["path/to/file1.js", "path/to/file2.js"],
  "suggestedFix": {
    "description": "brief description",
    "changes": [
      {
        "file": "path/to/file.js",
        "change": "description of change",
        "code": "the actual code change"
      }
    ]
  },
  "testSuggestion": "what to test after the fix"
}`;
}

/**
 * Claude APIを呼び出して分析を取得する
 */
async function _fetchClaudeAnalysis(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: 'claude-opus-4-1',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
    }

    return response.json();
}

/**
 * ClaudeのレスポンスからJSONを抽出する
 */
function _parseClaudeResponse(data) {
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Claude response');
    }
    return JSON.parse(jsonMatch[0]);
}

async function analyzeIssueWithClaude(issue) {
    console.log('🔍 Analyzing issue with Claude...');
    const prompt = _buildClaudePrompt(issue);
    const data = await _fetchClaudeAnalysis(prompt);
    return _parseClaudeResponse(data);
}

/**
 * Issue に基づいて修正ブランチを作成し、コミットを作成
 */
async function createFixBranch(issue, analysis) {
    const branchName = `fix/issue-${issue.number}`;
    const issueSlug = issue.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40);
    const fullBranchName = `${branchName}-${issueSlug}`;

    console.log(`🌿 Creating branch: ${fullBranchName}`);

    try {
        execFileSync('git', ['fetch', 'origin'], { stdio: 'inherit' });
        execFileSync('git', ['checkout', '-b', fullBranchName, 'origin/main'], {
            stdio: 'inherit',
        });
    } catch (error) {
        console.error('Failed to create branch:', error.message);
        throw error;
    }

    // ファイルを修正
    for (const change of analysis.suggestedFix.changes) {
        const safePath = path.resolve(process.cwd(), change.file);
        const relativePath = path.relative(process.cwd(), safePath);

        // Security: Prevent Path Traversal attacks / arbitrary file write
        if (
            relativePath.startsWith('..') ||
            path.isAbsolute(change.file) ||
            relativePath === ''
        ) {
            console.warn(`⚠️ Security Warning: Ignored path traversal attempt in file: ${change.file}`);
            continue;
        }

        const fileDir = path.dirname(safePath);

        // ディレクトリが存在しない場合は作成
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }

        // ファイルが存在する場合は読み込み、存在しない場合は新規作成
        let fileContent = '';
        if (fs.existsSync(safePath)) {
            fileContent = fs.readFileSync(safePath, 'utf-8');
        }

        // 変更を適用（簡易版：実際の実装ではより高度なマージが必要）
        const updatedContent = fileContent + '\n\n' + change.code;
        fs.writeFileSync(safePath, updatedContent);

        console.log(`✏️  Modified: ${change.file}`);
    }

    // コミット
    const commitMessage = `fix(#${issue.number}): ${issue.title}

Fixes #${issue.number}

${analysis.rootCause}`;

    execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
    execFileSync('git', ['commit', '-m', commitMessage], { stdio: 'inherit' });
    execFileSync('git', ['push', 'origin', fullBranchName], { stdio: 'inherit' });

    return { branchName: fullBranchName, commitMessage };
}

/**
 * PR を作成
 */
async function createPullRequest(issue, analysis, branch) {
    console.log('🔄 Creating pull request...');

    const prTitle = `fix: ${issue.title}`;
    const prBody = `## 🔧 Fix for Issue #${issue.number}

### 分析結果
**重要度**: ${analysis.severity}

### 根本原因
${analysis.rootCause}

### 修正内容
${analysis.suggestedFix.description}

### テスト方法
${analysis.testSuggestion}

### チェックリスト
- [ ] テストが全て成功している
- [ ] ドキュメントを更新した
- [ ] 変更が Issue #${issue.number} を解決している

Closes #${issue.number}`;

    const repo = getSanitizedRepo();
    const pr = await githubRequest(`/repos/${repo}/pulls`, {
        method: 'POST',
        body: {
            title: prTitle,
            head: branch.branchName,
            base: 'main',
            body: prBody,
            draft: false,
        },
    });

    console.log(`✅ PR created: ${pr.html_url}`);
    return pr;
}

/**
 * メイン処理
 */
async function main() {
    if (!ISSUE_NUMBER) {
        console.error('❌ ISSUE_NUMBER environment variable is not set');
        process.exit(1);
    }

    if (!GITHUB_TOKEN || !ANTHROPIC_API_KEY) {
        console.error('❌ Missing required environment variables');
        process.exit(1);
    }

    try {
        // Issue を取得
        const issue = await getIssueDetails(ISSUE_NUMBER);
        console.log(`📝 Processing: ${issue.title}`);

        // Claude で分析
        const analysis = await analyzeIssueWithClaude(issue);
        console.log(`✅ Analysis complete: ${analysis.severity} severity`);

        // 修正ブランチを作成してコミット
        const branch = await createFixBranch(issue, analysis);
        console.log(`✅ Branch and commit created: ${branch.branchName}`);

        // PR を作成
        const pr = await createPullRequest(issue, analysis, branch);
        console.log(`✅ PR #${pr.number} created successfully!`);

        // 成功を記録
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    githubRequest,
    getSanitizedRepo,
    getIssueDetails,
    analyzeIssueWithClaude,
    createFixBranch,
    createPullRequest,
    main,
};
