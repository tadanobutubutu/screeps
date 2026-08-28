// TODO: Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    const uniqueLandmarks = [];
    
    for (const landmark of landmarks) {
        if (!seen.has(landmark.id)) {
            seen.add(landmark.id);
            uniqueLandmarks.push(landmark);
        }
    }
    
    return uniqueLandmarks;
}

module.exports = {
    ensureUniqueLandmarks
};