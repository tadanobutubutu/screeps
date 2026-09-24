const fs = require('fs');

const filePath = './visual.effects.js';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `function secureRandomFloat() {
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
            const buf = crypto.randomBytes(4);
            return buf.readUInt32LE(0) / (0xffffffff + 1);
        }
    } catch (e) {
        // Fallback handled below
    }
    // Fallback: Use Web Crypto API if available, otherwise return 0 to fail safely
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xffffffff + 1);
    }
    return 0; // Secure fallback
}`;

const oldStr = `function secureRandomFloat() {
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
            const buf = crypto.randomBytes(4);
            return buf.readUInt32LE(0) / (0xffffffff + 1);
        }
    } catch (e) {
        // Fallback
    }
    return Math.random();
}`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the target string. The content is:");
    console.log(content.substring(0, 1000));
}
