function secureRandom() {
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
            const buf = crypto.randomBytes(4);
            const num = buf.readUInt32LE(0);
            return num / (0xffffffff + 1);
        } else if (Math && Math.random) {
            return Math.random();
        }
    } catch (e) {
        return Math.random();
    }
    return Math.random();
}

module.exports = { secureRandom };