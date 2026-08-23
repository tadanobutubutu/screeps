// main.js

// Import required module(s)
import { attachListeners } from './listeners';

// Existing code preserved
const img = document.querySelector('img');
let rotation = 0;

export function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

export function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// Attach event listeners
attachListeners(rotate, rotateBack);