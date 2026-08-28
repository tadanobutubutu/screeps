// main.js

// TODO: Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = typeof landmark === 'object' && landmark !== null
            ? JSON.stringify(landmark)
            : String(landmark);
        
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Example landmarks data
const landmarks = [
    { id: 1, name: 'Tower', x: 10, y: 20 },
    { id: 2, name: 'Castle', x: 30, y: 40 },
    { id: 1, name: 'Tower', x: 10, y: 20 }, // Duplicate
    { id: 3, name: 'Bridge', x: 50, y: 60 }
];

// Process landmarks
const uniqueLandmarks = ensureUniqueLandmarks(landmarks);

console.log('Unique landmarks:', uniqueLandmarks);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ensureUniqueLandmarks };
}