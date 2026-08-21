#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');

const GITHUB_API = 'https://api.github.com';
// Dynamic env evaluation for testing
const getGithubToken = () => process.env.GITHUB_TOKEN;
const getIssueAuthor = () => process.env.ISSUE_AUTHOR;
const getRepo = () => process.env.GITHUB_REPOSITORY || 'tadanobutubutu/screeps';

/**
 * GitHub API リクエスト実行
 */
async function githubRequest(endpoint, options = {}) {
    const url = `${GITHUB_API}${endpoint}`;
    const headers = {
        Authorization: `token ${getGithubToken()}`,
        Accept: 'application/vnd.github+json',
        ...options.headers,
    };


    return new Promise((resolve, reject) => {
        const https = require('https');
        const req = https.request(url, {
            method: options.method || 'GET',
            headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`GitHub API error: ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });

}

/**
 * Issue 作成者の情報を取得
 */
async function getUserInfo(username) {
    console.log(`👤 Fetching user info for: ${username}`);
    const user = await githubRequest(`/users/${username}`);
    return user;
}

/**
 * .all-contributorsrc から contributors を取得
 */
function getAllContributorsConfig() {
    const rcPath = path.join(process.cwd(), '.all-contributorsrc');
    if (!fs.existsSync(rcPath)) {
        console.warn('⚠️  .all-contributorsrc not found');
        return null;
    }

    return JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
}

/**
 * Contributor として追加されているか確認
 */
function isAlreadyContributor(config, username) {
    if (!config || !config.contributors) return false;
    return config.contributors.some((c) => c.login === username);
}

/**
 * .all-contributorsrc に Contributor を追加
 */
function addContributorToConfig(config, user) {
    if (!config.contributors) {
        config.contributors = [];
    }

    const contributor = {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        profile: user.html_url,
        contributions: ['bug'],
    };

    config.contributors.push(contributor);
    return config;
}

/**
 * .all-contributorsrc を更新
 */
function updateAllContributorsConfig(config) {
    const rcPath = path.join(process.cwd(), '.all-contributorsrc');
    fs.writeFileSync(rcPath, JSON.stringify(config, null, 2) + '\n');
    console.log('✅ Updated .all-contributorsrc');
}

/**
 * README を更新（all-contributors CLI を使用）
 */
function updateReadme() {
    try {
        console.log('📝 Updating README with all-contributors...');
        execSync('npx all-contributors-cli generate', { stdio: 'inherit' });
        console.log('✅ README updated');
    } catch (error) {
        console.warn('⚠️  Failed to update README:', error.message);
    }
}

/**
 * 変更をコミット・プッシュ
 */
function commitAndPush(username) {
    try {
        console.log('📤 Committing changes...');
        execFileSync('git', ['add', '.all-contributorsrc', 'README.md'], { stdio: 'inherit' });
        execFileSync('git', ['commit', '-m', `docs: add ${username} as a contributor`], {
            stdio: 'inherit',
        });
        execFileSync('git', ['push', 'origin', 'HEAD'], { stdio: 'inherit' });
        console.log('✅ Changes pushed');
    } catch (error) {
        console.warn('⚠️  Failed to commit/push:', error.message);
    }
}

/**
 * メイン処理
 */
async function main() {
    if (!getIssueAuthor() || !getGithubToken()) {
        console.warn('⚠️  Missing ISSUE_AUTHOR or GITHUB_TOKEN');
        return;
    }

    try {
        // Contributor 設定を取得
        const config = getAllContributorsConfig();
        if (!config) {
            console.log('ℹ️  Skipping contributor addition (no .all-contributorsrc)');
            return;
        }

        // 既に contributor の場合はスキップ
        if (isAlreadyContributor(config, getIssueAuthor())) {
            console.log(`ℹ️  ${getIssueAuthor()} is already a contributor`);
            return;
        }

        // ユーザー情報を取得
        const user = await getUserInfo(getIssueAuthor());

        // Contributor として追加
        const updatedConfig = addContributorToConfig(config, user);
        updateAllContributorsConfig(updatedConfig);

        // README を更新
        updateReadme();

        // コミット・プッシュ
        commitAndPush(user.login);

        console.log(`✅ ${user.login} added as a contributor!`);
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
    getUserInfo,
    getAllContributorsConfig,
    isAlreadyContributor,
    addContributorToConfig,
    updateAllContributorsConfig,
    updateReadme,
    commitAndPush,
    main,
    getGithubToken,
    getIssueAuthor,
    getRepo
};
