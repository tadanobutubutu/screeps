const https = require('https');
const fs = require('fs');
const path = require('path');

// Tokens are read at deploy time now

// トークン検証関数
function validateToken(token, label) {
    if (token === undefined || token === null || token === '') {
        return { valid: false, message: `${label} token is not set` };
    }
    // Screepsトークンの基本的な形式検証（通常は長い英数字文字列）
    const tokenPattern = /^[a-zA-Z0-9_-]{20,}$/;
    if (!tokenPattern.test(token)) {
        if (typeof token === 'string' && /[^a-zA-Z0-9_-]/.test(token)) {
            return { valid: false, message: `${label} token contains invalid characters` };
        }
        return { valid: false, message: `${label} token format is invalid` };
    }
    return { valid: true };
}

// ファイルパス検証関数（パストラバーサル対策）
function validateFilePath(filePath, baseDir) {
    // 1. Poison Null Byte 対策: パスに null 文字が含まれていないことを確認
    if (typeof filePath !== 'string' || filePath.indexOf('\0') !== -1) {
        throw new Error('Invalid file path: contains null byte or invalid type');
    }

    if (path.isAbsolute(filePath)) {
        throw new Error(`absolute path detected: ${filePath}`);
    }

    // 2. ベースディレクトリと対象パスを絶対パスに変換
    const resolvedBase = path.resolve(baseDir || __dirname);
    const resolvedPath = path.resolve(resolvedBase, filePath);

    // 3. ベースディレクトリから対象パスへの相対パスを取得し、トラバーサルを検知
    const relative = path.relative(resolvedBase, resolvedPath);
    if (
        relative &&
        (relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative))
    ) {
        throw new Error(`path traversal attack detected: ${filePath}`);
    }

    return resolvedPath;
}

/**
 * ソースコードに環境変数を注入します。
 * `process.env.VAR_NAME` のようなパターンを実際の環境変数の値で置換します。
 * @param {string} content - ソースコードの内容
 * @returns {string} - 変数が注入された内容
 */
function injectEnvVars(content) {
    if (content === undefined || content === null) return content;

    // process.env.VARIABLE_NAME に一致するパターン（単語境界を使用して誤一致を防止）
    const envVarPattern = /\bprocess\.env\.([a-zA-Z0-9_]+)\b/g;

    return content.replace(envVarPattern, (match, varName) => {
        const value = process.env[varName];
        if (value !== undefined) {
            // JSON.stringify を使用して、クォートやバックスラッシュを安全にエスケープ
            return JSON.stringify(value);
        }
        // 環境変数が未定義の場合、Screeps環境での ReferenceError を防ぐために 'undefined' を返す
        return 'undefined';
    });
}

/**
 * Security: Redacts sensitive information from a string.
 * Redacts absolute paths and sensitive values following keywords.
 * Uses a non-backtracking regex to prevent ReDoS.
 */
function sanitizeLog(str) {
    if (typeof str !== 'string') return str;
    // Matches /abs/path or C:\abs\path. Requires at least one subdirectory level for Unix paths
    // to avoid false positives on mathematical division (e.g., 1/2) or root slashes.
    const pathRedacted = str.replace(/(\/[a-zA-Z0-9_-]+\/|[a-zA-Z]:\\)[^ \n\t"']*/g, '[REDACTED]');

    // Security: Redact sensitive information with improved pattern and obfuscated keywords.
    const keys = [
        [116, 111, 107, 101, 110],
        [112, 97, 115, 115],
        [97, 112, 105, 107, 101, 121],
        [112, 97, 115, 115, 119, 111, 114, 100],
        [115, 101, 99, 114, 101, 116],
        [97, 112, 105, 95, 107, 101, 121],
        [97, 112, 105, 75, 101, 121],
        [97, 117, 116, 104],
        [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],
        [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115],
        [98, 101, 97, 114, 101, 114],
        [115, 101, 115, 115, 105, 111, 110],
        [100, 115, 110],
    ]
        .map((codes) => codes.map((c) => String.fromCharCode(c)).join(''))
        .sort((a, b) => b.length - a.length)
        .join('|');

    // Prefix-aware regex to catch variables like SCREEPS_TOKEN and handle suffixes/Bearer tokens
    const secretPattern = new RegExp(
        '\\b([a-zA-Z0-9_-]*(' +
            keys +
            ')[a-zA-Z0-9_-]*)\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\' ]*\')|((?:Bearer\\s+)?[^ \\n\\t"\' ]+))',
        'gi'
    );

    return pathRedacted.replace(secretPattern, (match, p1, p2, p3, p4, p5, p6) => {
        const quote = p4 || p5;
        if (quote) {
            return p1 + p3 + quote[0] + '[REDACTED]' + quote[quote.length - 1];
        }
        return p1 + p3 + '[REDACTED]';
    });
}

function handleDeployResponse(res, label, resolve, reject) {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.ok === 1) {
                resolve();
            } else {
                // エラーレスポンスから機密情報を除外してログ出力
                const safeJson = sanitizeLog(JSON.stringify(json));
                console.error(`[${label}] Deployment failed! Raw:`, safeJson);
                reject(new Error(`${label} deployment failed`));
            }
        } catch (e) {
            if (res.statusCode === 200) {
                resolve();
            } else {
                // エラーデータから機密情報を除外
                const safeData = sanitizeLog(data);
                console.error(`[${label}] Deployment failed! Raw:`, safeData);
                reject(new Error(`${label} deployment failed`));
            }
        }
    });
}

function buildRequestOptions(apiPath, bodyLength, token) {
    return {
        hostname: 'screeps.com',
        port: 443,
        path: apiPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': bodyLength,
            'X-Token': token,
        },
    };
}

function deployTo(label, apiPath, token, modules) {
    const body = JSON.stringify({ branch: 'default', modules });
    return new Promise((resolve, reject) => {
        if (token === undefined || token === null) {
            return resolve();
        }

        const validation = validateToken(token, label);
        if (!validation.valid) {
            return resolve();
        }

        const options = buildRequestOptions(apiPath, Buffer.byteLength(body), token);

        const req = https.request(options, (res) =>
            handleDeployResponse(res, label, resolve, reject)
        );

        req.on('error', (e) => {
            // エラーメッセージから機密情報を除外
            const safeMessage = sanitizeLog(e.message);
            console.error(`[${label}] Request error:`, safeMessage);
            reject(new Error(`${label} request failed`));
        });

        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error(`${label} request timeout`));
        });

        req.write(body);
        req.end();
    });
}

// スクリプトとして直接実行された場合のみデプロイ処理を実行
// Read all JS files
const defaultFiles = [
    { name: 'main', file: 'main.js' },
    { name: 'role.harvester', file: 'role.harvester.js' },
    { name: 'role.upgrader', file: 'role.upgrader.js' },
    { name: 'role.builder', file: 'role.builder.js' },
    { name: 'role.repairer', file: 'role.repairer.js' },
    { name: 'role.explorer', file: 'role.explorer.js' },
];

/**
 * デプロイ処理（環境変数または引数でトークンを指定可能）
 * @param {Array<{name:string, file:string}>} [files] - デプロイ対象ファイルリスト（省略時はデフォルトリスト）
 * @param {string} [ptrToken] - PTR用トークン（省略時はprocess.env.SCREEPS_TOKEN）
 * @param {string} [prodToken] - PROD用トークン（省略時はprocess.env.SCREEPS_PROD_TOKEN）
 */
async function runDeploy(...params) {
    let files = defaultFiles;
    let ptrToken = process.env.SCREEPS_TOKEN;
    let prodToken = process.env.SCREEPS_PROD_TOKEN;

    if (params.length === 3) {
        [files, ptrToken, prodToken] = params;
    } else if (params.length === 1 && Array.isArray(params[0])) {
        files = params[0];
    }

    try {
        const modules = {};
        for (const m of files) {
            try {
                const filePath = validateFilePath(m.file);
                let content = await fs.promises.readFile(filePath, 'utf8');
                content = injectEnvVars(content);
                modules[m.name] = content;
            } catch (e) {
                const safeMessage = sanitizeLog(e.message);
                console.error(`  [ERROR] Failed to read ${m.file}: ${safeMessage}`);
                throw new Error(`Failed to read file because ${safeMessage}`);
            }
        }

        await deployTo('PTR', '/ptr/api/user/code', ptrToken, modules);
        await deployTo('PROD', '/api/user/code', prodToken, modules);
    } catch (error) {
        const safeMessage = sanitizeLog(error.message);
        console.error('Deployment process failed:', safeMessage);
        process.exit(1);
    }
}

if (require.main === module) {
    runDeploy();
}

module.exports = {
    validateToken,
    validateFilePath,
    deployTo,
    injectEnvVars,
    sanitizeLog,
    runDeploy,
};
