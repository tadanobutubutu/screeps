// Main application file

const landmarks = [];

// Existing landmark tracking
function addLandmark(name, coordinates) {
    const landmark = {
        id: Date.now(),
        name: name,
        coordinates: coordinates
    };
    landmarks.push(landmark);
    return landmark;
}

// TODO: Implement functions to ensure unique landmarks here
function ensureUniqueLandmarks() {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = `${landmark.name}-${landmark.coordinates}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function isLandmarkUnique(name, coordinates) {
    return !landmarks.some(
        landmark => 
            landmark.name === name && 
            landmark.coordinates === coordinates
    );
}

function removeDuplicateLandmarks() {
    const uniqueLandmarks = ensureUniqueLandmarks();
    landmarks.length = 0;
    landmarks.push(...uniqueLandmarks);
    return landmarks;
}

function getUniqueLandmarkByName(name) {
    const matches = landmarks.filter(l => l.name === name);
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return matches[0];
}

// Existing export
module.exports = {
    addLandmark,
    ensureUniqueLandmarks,
    isLandmarkUnique,
    removeDuplicateLandmarks,
    getUniqueLandmarkByName,
    landmarks
};