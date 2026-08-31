const express = require('express');
const path = require('path');

class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// Landmark data structure
const landmarks = [];

// TODO: Implement spawning logic
function spawnNewUser(name, age) {
    return new User(name, age);
}

// Configuration
const config = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
};

// App state
const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

function validateLandmark(landmark) {
    const errors = [];

    // Check if landmark exists
    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }

    // Validate name
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
        errors.push('Landmark must have a valid name');
    }

    // Validate latitude
    if (landmark.latitude === undefined || landmark.latitude === null) {
        errors.push('Landmark must have a latitude');
    } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
        errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
        errors.push('Landmark latitude must be between -90 and 90');
    }

    // Validate longitude
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }

    // Additional validation changes from the other branch
    if (Array.isArray(landmark) && landmark.length > 0) {
        if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
            errors.push('Landmark array must have valid names');
        }
    }

    return { valid: errors.length === 0, errors };
}

function ensureLandmarkUniqueness(elements, landmarks) {
    const usedIds = new Set();

    if (Array.isArray(elements)) {
        for (const landmark of elements) {
            if (landmark.id && landmarks.includes(landmark.name)) {
                if (usedIds.has(landmark.id)) {
                    // Mark as duplicate by adding suffix
                    landmark.id += '_duplicate';
                    usedIds[landmark.id + '_duplicate'] = true;
                } else {
                    usedIds[landmark.id] = true;
                }
            }
        }
    }

    return elements;
}

function processUniqueElements(elements) {
    const seen = new Set();
    const uniqueElements = [];

    if (Array.isArray(elements)) {
        elements.forEach(element => {
            const key = element.id || element.name || JSON.stringify(element);
            if (!seen.has(key)) {
                seen.add(key);
                uniqueElements.push(element);
            }
        });
    }

    return uniqueElements;
}

// Implemented validateLandmark functionality

function initializeApp() {
    initialize();
    return appState;
}

// Main function (required export)

function main() {
    initialize();
    initializeApp();
    console.log('Main function executed');
    return { executed: true };
}

// Export functions for use in other modules or tests

module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    ensureLandmarkUniqueness,
    processUniqueElements,
    checkLandmarkElement,
    validateLandmark
};