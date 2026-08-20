#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_AUTHOR = process.env.ISSUE_AUTHOR;
const GITHUB_API = 'https://api.github.com';
const REPO = process.env.GITHUB_REPOSITORY || 'tadanobutubutu/screeps';

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
        const error = await response.json();
        throw new Error(`GitHub API error: ${response.status} ${JSON.stringify(error)}`);
    }

    return response.json();
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
    if (!ISSUE_AUTHOR || !GITHUB_TOKEN) {
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
        if (isAlreadyContributor(config, ISSUE_AUTHOR)) {
            console.log(`ℹ️  ${ISSUE_AUTHOR} is already a contributor`);
            return;
        }

        // ユーザー情報を取得
        const user = await getUserInfo(ISSUE_AUTHOR);

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

main();
