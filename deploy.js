/**
 * deploy.js
 *
 * Deployment script for Screeps AI.
 */

'use strict';

const path = require('path');

/**
 * Redacts sensitive values from log messages.
 * Matches keywords like 'token', 'pass', etc., and redacts their values.
 */
function sanitizeLog(message) {
    if (typeof message !== 'string') return message;

    let sanitized = message;
    const keywords = ['token', 'pass', 'apikey', 'secret', 'credential', 'password', 'auth', 'bearer', 'session'];

    // Redact absolute paths first
    const pathRegex = /(\/[a-zA-Z0-9_-]+\/|[a-zA-Z]:\\)[^ \n\t"']*/g;
    sanitized = sanitized.replace(pathRegex, '[PATH_REDACTED]');

    // Redact values after keywords (e.g., token=secret -> token=[REDACTED])
    for (const word of keywords) {
        const regex = new RegExp(`(${word}\\s*[=:]\\s*)[^\\s&"']+`, 'gi');
        sanitized = sanitized.replace(regex, '$1[REDACTED]');
    }

    return sanitized;
}

function injectEnvVars(config) {
    if (!config || typeof config !== 'object') return config;
    const env = process.env || {};
    const updated = { ...config };
    if (env.SCREEPS_TOKEN) updated.token = env.SCREEPS_TOKEN;
    if (env.SCREEPS_USER) updated.user = env.SCREEPS_USER;
    if (env.SCREEPS_PASS) updated.password = env.SCREEPS_PASS;
    return updated;
}

function validateToken(token, serverName) {
    if (!token || typeof token !== 'string' || token.trim() === '') {
        return { valid: false, message: `Token for ${serverName} is not set.` };
    }
    if (token.length < 10 || !/^[a-zA-Z0-9_-]+$/.test(token)) {
        return { valid: false, message: `Token format is invalid for ${serverName}.` };
    }
    return { valid: true };
}

function validateFilePath(filePath, baseDir) {
    if (!filePath || filePath.indexOf('\0') !== -1) {
        throw new Error('File path contains null byte');
    }

    const absoluteBase = path.resolve(baseDir);
    const resolvedPath = path.resolve(baseDir, filePath);

    // Check if the path is absolute
    if (path.isAbsolute(filePath)) {
        throw new Error('Absolute paths are not allowed');
    }

    // Check for traversal
    if (!resolvedPath.startsWith(absoluteBase + path.sep) && resolvedPath !== absoluteBase) {
        throw new Error('Path traversal detected');
    }

    return resolvedPath;
}

async function deployTo(serverName, apiPath, token, data) {
    const validation = validateToken(token, serverName);
    if (!validation.valid) {
        console.log(`Skipping ${serverName} deployment: ${validation.message}`);
        return;
    }

    return new Promise((resolve, reject) => {
        const https = require('https');
        const options = {
            method: 'POST',
            headers: { 'X-Token': token }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        if (json.ok === 1) return resolve();
                        reject(new Error(`${serverName} deployment failed`));
                    } catch (e) {
                        resolve(); // Success on parse error if status 200
                    }
                } else {
                    const sanitizedBody = sanitizeLog(body);
                    console.error(`[${serverName}] Deployment failed! Raw:`, sanitizedBody);
                    reject(new Error(`${serverName} deployment failed`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('timeout'));
        });
        req.write(JSON.stringify(data));
        req.end();
    });
}

module.exports = {
    sanitizeLog,
    injectEnvVars,
    validateToken,
    validateFilePath,
    deployTo
};
