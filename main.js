// main.js

// TODO: Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
    const uniqueLandmarks = [];
    const seenKeys = new Set();
    
    for (const landmark of landmarks) {
        const key = landmark.name || landmark.id || JSON.stringify(landmark);
        
        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueLandmarks.push(landmark);
        }
    }
    
    return uniqueLandmarks;
}

// Export for use in other modules
module.exports = {
    ensureUniqueLandmarks
};