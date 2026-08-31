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

// Initialize function
function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

// Landmark validation function with merged logic from both branches
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

    // Additional validation: check for array composition with