// main.js - Application entry point
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark && 
           typeof landmark.id !== 'undefined' && 
           landmark.id !== null;
}

// Load landmarks from file
function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
    
    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        
        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Get landmark by ID
function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const seen = new Set();
    const uniqueLandmarks = [];
    
    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }
        
        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);
        
        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }
    
    return uniqueLandmarks;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        isValidLandmark,
        loadLandmarks,
        processLandmarks,
        sortLandmarks,
        getLandmarkById,
        ensureUniqueLandmarks
    };
}

// Main execution when run directly
if (require.main === module) {
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);
    
    console.log(`Loaded ${landmarks.length} landmarks`);
    console.log(`Processed to ${processed.length} unique landmarks`);
    console.log(`Sorted ${sorted.length} landmarks`);
    
    if (sorted.length > 0) {
        console.log('First landmark:', sorted[0]);
    }
}