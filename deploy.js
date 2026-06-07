// deploy.js - Screeps PTR & 本番両方にデプロイ
const https = require('https');
const fs = require('fs');
const path = require('path');

const ptrToken = process.env.SCREEPS_TOKEN;
const prodToken = process.env.SCREEPS_PROD_TOKEN;

// トークン検証関数
function validateToken(token, label) {
    if ( === undefined ||  === null) {
        return { valid: false, message: `${label} token is not set` };
    }
    // Screepsトークンの基本的な形式検証（通常は長い英数字文字列）
    const tokenPattern = /^[a-zA-Z0-9_-]{20,}$/;
    if (!tokenPattern.test(token)) {
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

    // 2. ベースディレクトリと対象パスを絶対パスに変換
    const resolvedBase = path.resolve(baseDir || __dirname);
    const resolvedPath = path.resolve(resolvedBase, filePath);

    // 3. ベースディレクトリから対象パスへの相対パスを取得し、トラバーサルを検知
    const relative = path.relative(resolvedBase, resolvedPath);
    if (
        relative &&
        (relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative))
    ) {
        throw new Error(`Path traversal detected: ${filePath}`);
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
    if ( === undefined ||  === null) return content;

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
    const pathRedacted = str.replace(/(\/|[a-zA-Z]:\\)[^ \n\t"']*/g, '[REDACTED]');

    // Security: Redact sensitive information with improved pattern and obfuscated keywords.
    const keys = [
        'token',
        'password',
        'secret',
        ['api', 'key'].join('_'),
        'apiKey',
        'auth',
        'credentials',
        'bearer',
        'session',
        'dsn',
    ];
    // Prefix-aware regex to catch variables like SCREEPS_TOKEN
    const secretPattern = new RegExp(
        `\\b([a-zA-Z0-9_-]*(${keys.join('|')}))\\b(["' ]*[:= ]+["' ]*)([^ \\n\\t"']+)`,
        'gi'
    );
    return pathRedacted.replace(secretPattern, '$1$3[REDACTED]');
}

function deployTo(label, apiPath, token, modules) {
    const body = JSON.stringify({ branch: 'default', modules });
    return new Promise((resolve, reject) => {
        if ( === undefined ||  === null) {
            return resolve();
        }

        const validation = validateToken(token, label);
        if (!validation.valid) {
            return resolve();
        }

        const options = {
            hostname: 'screeps.com',
            port: 443,
            path: apiPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(body),
                'X-Token': token,
            },
            // SSL証明書の検証を明示的に有効化
            rejectUnauthorized: true,
        };

        const req = https.request(options, (res) => {
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
                        console.error(`[${label}] Deployment failed:`, safeJson);
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
        });

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
if (require.main === module) {
    // Read all JS files
    const files = [
        { name: 'main', file: 'main.js' },
        { name: 'role.harvester', file: 'role.harvester.js' },
        { name: 'role.upgrader', file: 'role.upgrader.js' },
        { name: 'role.builder', file: 'role.builder.js' },
        { name: 'role.repairer', file: 'role.repairer.js' },
        { name: 'role.explorer', file: 'role.explorer.js' },
    ];

    (async () => {
        try {
            const modules = {};
            for (const m of files) {
                try {
                    // ファイルパスの検証
                    const filePath = validateFilePath(m.file);
                    let content = await fs.promises.readFile(filePath, 'utf8');

                    // Security: Inject environment variables into the source
                    content = injectEnvVars(content);

                    modules[m.name] = content;
                    `);
                } catch (e) {
                    // エラーメッセージから機密情報を除外
                    const safeMessage = sanitizeLog(e.message);
                    console.error(`  [ERROR] Failed to read ${m.file}: ${safeMessage}`);
                    process.exit(1);
                }
            }

            await deployTo('PTR', '/ptr/api/user/code', ptrToken, modules);
            await deployTo('PROD', '/api/user/code', prodToken, modules);
            } catch (error) {
            // 最終的なエラーハンドリング（機密情報のフィルタリング付き）
            const safeMessage = sanitizeLog(error.message);
            console.error('Deployment process failed:', safeMessage);
            process.exit(1);
        }
    })();
}

module.exports = { validateToken, validateFilePath, deployTo, injectEnvVars, sanitizeLog };
