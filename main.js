<main id="main-content" role="main" lang="en">
// Accessibility fixes
// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = "en";
// - REACT_025: Ensure unique landmarks (from merge conflict)
// - REACT_036: Fix fake link issue
// - REACT_041: Add accessible names to SVGs
// Wrap primary content in <main> for accessibility
primaryContent = ' <main id="main-content" role="main" lang="en"> ... </main> ';
// Create and configure elements with accessibility roles
const mainElement = document.querySelector('#main-content');
const rotateBackButton = ' <button id="unrotate" class="rotate-back-button" aria-label="Rotate back"> rotate back </button> ';
// Ensure ARIA attributes and landmark roles are applied
document.body.setAttribute('role', 'document');
const banner = document.createElement('header');
banner.setAttribute('role', 'banner');
banner.setAttribute('id', 'banner');
document.body.prepend(banner);
const footer = document.createElement('footer');
footer.setAttribute('role', 'contentinfo');
footer.setAttribute('id', 'footer');
document.body.appendChild(footer);
// Implement accessibility features
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => th.setAttribute('scope', 'col'));
const sections = document.querySelectorAll('section');
sections.forEach(section => {
section.setAttribute('role', 'region');
section.setAttribute('aria-label', section.getAttribute('aria-label') || 'Section');
});
// Fix table structure issues (REACT_017)
fixTableStructureIssues();
// Add unique IDs to landmarks
let uniqueIdCounter = 0;
const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
const landmarkIdMap = new Map();
landmarks.forEach(landmark => {
if (!landmark.id) {
let baseId = `landmark-${uniqueIdCounter++}`;
landmark.id = baseId;
landmarkIdMap.set(landmark, baseId);
} else {
landmarkIdMap.set(landmark, landmark.id);
}
});
// Ensure unique landmark IDs
const uniqueLandmarkIDs = new Set();
landmarkIdMap.forEach((id, landmark) => {
let currentId = id;
let index = 2;
while (uniqueLandmarkIDs.has(currentId)) {
currentId = `${id}-${index}`;
index++;
}
landmark.id = currentId;
uniqueLandmarkIDs.add(currentId);
});
// Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
const title = document.createElement('title');
title.id = `${svg.id || 'svg'}-title`;
title.textContent = svg.getAttribute('aria-label') || svg.title || `${svg.id ? svg.id : 'SVG'} image`;
const desc = document.createElement('desc');
desc.id = `${svg.id || 'svg'}-desc`;
desc.textContent = svg.getAttribute('aria-describedby') || '';
svg.insertBefore(title, svg.firstChild);
svg.appendChild(desc);
svg.setAttribute('aria-labelledby', `${title.id} ${desc.id}`);
});
// Fix fake links by replacing divs with buttons
fixFakeLinkIssues();
class AppController {
constructor() {
this.initializeAccessibility();
}
initializeAccessibility() {
addLangAttribute();
ensureUniqueLandmarks();
fixReactSVGAccessibility();
fixReactLandmarkIssues();
fixFakeLinkIssues();
fixTableStructureIssues();
}
}
// Game logic functions
function resetAllRotations() {
const rotateTargets = document.querySelectorAll('[data-rotate], .rotate-target');
rotateTargets.forEach(el => el.style.transform = 'none');
}
function rotateBack() {
const targets = document.querySelectorAll('[data-rotate], .rotate-target');
targets.forEach(el => el.style.transform = 'rotate(0deg)');
}
export { resetAllRotations, rotateBack };
// React-specific accessibility fixes
function fixReactSVGAccessibility() {
const layoutFiles = ['app/layout.tsx', 'dashboard/app/layout.tsx'];
layoutFiles.forEach(file => {
try {
const filePath = path.join(process.cwd(), file);
if (fs.existsSync(filePath)) {
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/<svg([^>]*?)>/gi, (match, attrs) => {
if (!attrs.includes('aria-hidden') && !attrs.includes('aria-label') && !attrs.includes('<title')) {
return `<svg aria-hidden="true"${attrs}>`;
}
return match;
});
fs.writeFileSync(filePath, content);
}
} catch (error) {
console.error(`Error fixing SVG accessibility in ${file}:`, error.message);
}
});
}
function fixReactLandmarkIssues() {
const tsxLayoutFiles = ['app/layout.tsx', 'dashboard/app/layout.tsx'];
const htmlFiles = ['docs/index.html', 'docs/table.html'];
tsxLayoutFiles.forEach(file => {
try {
const filePath = path.join(process.cwd(), file);
if (fs.existsSync(filePath)) {
let content = fs.readFileSync(filePath, 'utf8');
if (content.includes('{children}') && !content.includes('<main') && !content.includes('</main>')) {
content = content.replace(/\{children\}/g, '<main>{children}</main>');
}
fs.writeFileSync(filePath, content);
}
} catch (error) {
console.error(`Error fixing landmarks in ${file}:`, error.message);
}
});
htmlFiles.forEach(file => {
try {
const filePath = path.join(process.cwd(), file);
if (fs.existsSync(filePath)) {
let content = fs.readFileSync(filePath, 'utf8');
if (
content.includes('<body') &&
content.includes('</body>') &&
!content.includes('<main') &&
!content.includes('</main>')
) {
content = content.replace(
/<body([^>]*)>([\s\S]*)<\/body>/gi,
(match, attrs, bodyContent) =>
`<body${attrs}><main>${bodyContent}</main></body>`
);
}
fs.writeFileSync(filePath, content);
}
} catch (error) {
console.error(`Error fixing landmarks in ${file}:`, error.message);
}
});
}
// Fix fake link issues by replacing divs with buttons
function fixFakeLinkIssues() {
const htmlFiles = ['docs/index.html', 'docs/table.html'];
htmlFiles.forEach(file => {
try {
const filePath = path.join(process.cwd(), file);
if (fs.existsSync(filePath)) {
let content = fs.readFileSync(filePath, 'utf8');
// Replace divs with onclick with buttons
content = content.replace(/<div([^>]*?)onclick([^>]*?)>/gi, (match, before, after) =>
`<button${before}${after}>`);
// Ensure links have proper href
content = content.replace(/<a([^>]*?)>([\s\S]*?)<\/a>/gi, (match, attrs, rest) => {
if (!attrs.includes('href') && !attrs.includes('onclick')) {
return `<a href="#${attrs}">${rest}</a>`;
}
return match;
});
fs.writeFileSync(filePath, content);
}
} catch (error) {
console.error(`Error fixing fake links in ${file}:`, error.message);
}
});
}
// Import and render React components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Existing exports preserved
exports.handleReact19Update = handleReact19Update;
exports.handleJest30Update = handleJest30Update;
exports.handleEslint10Update = handleEslint10Update;
exports.handleTypeScript7Update = handleTypeScript7Update;
exports.fixReactSVGAccessibility = fixReactSVGAccessibility;
exports.fixReactLandmarkIssues = fixReactLandmarkIssues;
exports.addLangAttribute = addLangAttribute;
exports.fixTableStructureIssues = fixTableStructureIssues;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.fixFakeLinkIssues = fixFakeLinkIssues;
// React component rendering
ReactDOM.render(<App />, document.getElementById('root'));
// Existing functions preserved
function existingFunction() {
---