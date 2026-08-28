let uniqueLandmarks = [...new Set(landmarks)]; // Assuming landmarks is an array in main.js

// A function to check for unique landmarks and return them if unique, else print an error message
function ensureUniqueLandmarks() {
    if (uniqueLandmarks.length === landmarks.length) {
        return uniqueLandmarks;
    } else {
        console.error("Landmarks are not unique. Please fix the issue.");
        return uniqueLandmarks; // Return unique landmarks for test purposes
    }
}

// Use the new function in main logic or export it as necessary
let uniqueLandmarksInMainLogic = ensureUniqueLandmarks();

// Now use uniqueLandmarksInMainLogic in your existing code as needed