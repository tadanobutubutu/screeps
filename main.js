const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');

// User Safety constants and objects
const userSafetyObject = {
    unsafe: {
      category: 'Unauthorized Advice'
    }
};

// User Safety object structure for unsafe status
const UserSafetyObject = {
    unsafe: {
      category: 'Unauthorized Advice'
    }
};

// Dependency tracking
let dependencyGraph = {};

// Books array
const books = [];

// Config object - merged from both branches
const config = {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: process.env.TIMEOUT || 5000,
    debug: true,
    version: '1.0.0',
    name: 'MyApp',
    dataPath: './data',
    maxResults: 100
};

// Accessibility improvements
const getLangAttribute = () => document.documentElement.lang;

function setLanguageAttribute(element, lang) {
    element.setAttribute('lang', lang);
}

function getLangAttributeNew() {
    const lang = document?.documentElement?.lang || getLangAttribute();
    setLanguageAttribute(document, lang);
    return lang;
}

// REACT_015: Add lang attribute to HTML element
function getLangAttributeNew() {
  const lang = document?.documentElement?.lang || getLangAttributeFn();
  setLanguageAttribute(document, lang);
  return lang;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(element, existingAccessibleName = undefined) {
  if (!existingAccessibleName) {
    existingAccessibleName = getSvgAccessibleNameLocal(element);
  }
  if (existingAccessibleName) {
    return existingAccessibleName;
  }

  const svg = element.getElementsByTagName('svg')[0];
  if (svg) {
    const newAccessibleName = svg.getAttribute('aria-label') || getSvgAccessibleNameLocal(svg);
    if (newAccessibleName) {
      return newAccessibleName;
    }

    const fallbackId = `svg-fallback-title-${element.id}`;
    const newTitle = document.createElement('title');
    newTitle.id = fallbackId;
    newTitle.textContent = `SVG image ${element.id}`;
    svg.insertBefore(newTitle, svg.firstChild);
    return newTitle.textContent;
  }
  return undefined;
}

function getSvgAccessibleName(element, existingAccessibleName = undefined) {
  if (!existingAccessibleName) {
    existingAccessibleName = getSvgAccessibleNameLocal(element);
  }
  if (existingAccessibleName) {
    return existingAccessibleName;
  }

  const svg = element.getElementsByTagName('svg')[0];
  if (svg) {
    const newAccessibleName = svg.getAttribute('aria-label') || getSvgAccessibleNameLocal(svg);
    if (newAccessibleName) {
      return newAccessibleName;
    }

    const fallbackId = `svg-fallback-title-${element.id}`;
    const newTitle = document.createElement('title');
    newTitle.id = fallbackId;
    newTitle.textContent = `SVG image ${element.id}`;
    svg.insertBefore(newTitle, svg.firstChild);
    return newTitle.textContent;
  }
  return undefined;
}

// Function to create an accessible book entry object
function createAccessibleBookEntry(bookData) {
  const validation = validateBookAccessibility(bookData);
  if (!validation.isValid) {
    throw new Error(`Accessibility validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }
  
  const bookId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: bookId,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn ? bookData.isbn.trim() : null,
    description: bookData.description ? bookData.description.trim() : '',
    publishedDate: bookData.publishedDate || null,
    genre: bookData.genre || null
  };
}

// Utility functions
function getLangAttribute() {
  return document.documentElement.lang;
}

function setSvgAttributes(element, accessibleName) {
  if (!accessibleName) {
    accessibleName = getSvgAccessibleNameNew(element);
  }
  if (accessibleName) {
    element.setAttribute('aria-label', accessibleName);
  }
}

// Landmark functions
function validateLandmark