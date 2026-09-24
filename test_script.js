const crypto = require('crypto');
console.log("Random from crypto:", crypto.randomBytes(4).readUInt32LE(0) / (0xffffffff + 1));
