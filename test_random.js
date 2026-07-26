function secureRandom() {  
  try {  
    const crypto = require('crypto');  
    if (crypto && crypto.randomBytes) {  
      const buf = crypto.randomBytes(4);  
      const num = buf.readUInt32LE(0);  
      return num / (0xffffffff + 1);  
    }  
  } catch (e) {  
    // Fallback  
  }  
  throw new Error("No secure random number generator available.");  
}  

module.exports = { secureRandom };