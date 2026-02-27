// deploy.js - Screeps PTR & 本番両方にデプロイ
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ptrToken = process.env.SCREEPS_TOKEN;
const prodToken = process.env.SCREEPS_PROD_TOKEN;

// トークン検証関数
function validateToken(token, label) {
    if (!token) {
        return { valid: false, message: `${label} token is not set` };
    }
    // Screepsトークンの基本的な形式検証（通常は長い英数字文字列）
    const tokenPattern = /^[a-zA-Z0-9_-]{20,}$/;
    if (!tokenPattern.test(token)) {
        return { valid: false, message: `${label} token format is invalid` };
    }
    return { valid: true };
}

// トークン検証
const ptrValidation = validateToken(ptrToken, 'PTR');
const prodValidation = validateToken(prodToken, 'PROD');

if (!ptrValidation.valid && !prodValidation.valid) {
    console.error('Error: No valid tokens found');
    console.error(`PTR: ${ptrValidation.message}`);
    console.error(`PROD: ${prodValidation.message}`);
    process.exit(1);
}

if (!ptrValidation.valid) {
    console.warn(`Warning: ${ptrValidation.message}`);
}
if (!prodValidation.valid) {
    console.warn(`Warning: ${prodValidation.message}`);
}

// ファイルパス検証関数（パストラバーサル対策）
function validateFilePath(filePath) {
    const normalizedPath = path.normalize(filePath);
    const resolvedPath = path.resolve(__dirname, normalizedPath);
    
    // __dirname配下にあることを確認
    if (!resolvedPath.startsWith(__dirname)) {
        throw new Error(`Invalid file path: ${filePath}`);
    }
    
    // 親ディレクトリへの参照を含まないことを確認
    if (normalizedPath.includes('..')) {
        throw new Error(`Path traversal detected: ${filePath}`);
    }
    
    return resolvedPath;
}

// Read all JS files
const modules = {};
const files = [
    { name: 'main', file: 'main.js' },
    { name: 'role.harvester', file: 'role.harvester.js' },
    { name: 'role.upgrader', file: 'role.upgrader.js' },
    { name: 'role.builder', file: 'role.builder.js' },
    { name: 'role.repairer', file: 'role.repairer.js' },
    { name: 'role.explorer', file: 'role.explorer.js' },
];

console.log('Reading module files...');
for (const m of files) {
    try {
        // ファイルパスの検証
        const filePath = validateFilePath(m.file);
        modules[m.name] = fs.readFileSync(filePath, 'utf8');
        console.log(`  [OK] ${m.name} (${m.file})`);
    } catch (e) {
        // エラーメッセージから機密情報を除外
        const safeMessage = e.message.replace(/token/gi, '[REDACTED]');
        console.error(`  [ERROR] Failed to read ${m.file}: ${safeMessage}`);
        process.exit(1);
    }
}

const body = JSON.stringify({ branch: 'default', modules });

function deployTo(label, apiPath, token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            console.log(`[${label}] Token not set, skipping.`);
            return resolve();
        }
        
        const validation = validateToken(token, label);
        if (!validation.valid) {
            console.log(`[${label}] ${validation.message}, skipping.`);
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
        
        console.log(`[${label}] Deploying...`);
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`[${label}] Status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    if (json.ok === 1) {
                        console.log(`[${label}] Deployed successfully!`);
                        resolve();
                    } else {
                        // エラーレスポンスから機密情報を除外してログ出力
                        const safeJson = JSON.stringify(json).replace(/token/gi, '[REDACTED]');
                        console.error(`[${label}] Deployment failed:`, safeJson);
                        reject(new Error(`${label} deployment failed`));
                    }
                } catch (e) {
                    if (res.statusCode === 200) {
                        console.log(`[${label}] Deployed successfully!`);
                        resolve();
                    } else {
                        // エラーデータから機密情報を除外
                        const safeData = data.replace(/token/gi, '[REDACTED]');
                        console.error(`[${label}] Deployment failed! Raw:`, safeData);
                        reject(new Error(`${label} deployment failed`));
                    }
                }
            });
        });
        
        req.on('error', (e) => {
            // エラーメッセージから機密情報を除外
            const safeMessage = e.message.replace(/token/gi, '[REDACTED]');
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

(async () => {
    try {
        await deployTo('PTR', '/ptr/api/user/code', ptrToken);
        await deployTo('PROD', '/api/user/code', prodToken);
        console.log('All done!');
    } catch (error) {
        // 最終的なエラーハンドリング（機密情報のフィルタリング付き）
        const safeMessage = error.message.replace(/token/gi, '[REDACTED]');
        console.error('Deployment process failed:', safeMessage);
        process.exit(1);
    }
})();
