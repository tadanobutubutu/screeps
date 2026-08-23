// Import existing dependencies and create the app
import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

// Append lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// Create and configure the router
const router = new App();
const routes = router.createViewMap();

// Single Page Router
const configureRouter = () => {
    router.loadViews(routes);
    router.start();
};

// Append Accessibility Names to SVGs
( () => {
    let elements = document.getAllByRole('img');
    elements.forEach(element => {
        if(element.src.includes('arrow')) {
            element.setAttribute('aria-label', 'Arrow');
        }
    });
})();

// Ensure Unique Landmarks
{
    const landmarks = Array.from(document.querySelectorAll('[aria-required]'));
    landmarks.forEach(landmark => {
        const normalizedRole = roleLandmark(landmark).toLowerCase();
        document.documentElement.setAttribute(`aria-labelledby`, normalizedRole);
    });
}

hydrate(<App />, document.getElementById('root'));