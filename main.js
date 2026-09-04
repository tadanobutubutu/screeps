import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import { require as commonjsRequire } from 'commonjs';

let dependencyGraph = {};

// Ensure the dependencyGraph container has a proper ARIA role
function setupDependencyGraph() {
    if (typeof document === 'undefined') return null;
    const depGraph = document.querySelector('#dependency-graph');
    if (depGraph) {
        if (!depGraph.hasAttribute('role')) depGraph.setAttribute('role