function secureRandom() {
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
            const buf = crypto.randomBytes(4);
            const num = buf.readUInt32LE(0);
            return num / (0xffffffff + 1);
        } else if (Math && Math.random) { // Added to accommodate JavaScript environments without the crypto module
            return Math.random();
        }
    } catch (e) {
        // Fallback
        return Math.random(); // Return Math.random() as a fallback for both cases when crypto is unavailable
    }
    throw new Error("No secure random number generator available.");
}

module.exports = { secureRandom };
