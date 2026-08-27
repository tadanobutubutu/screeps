// Main.js - Application Entry Point

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sample function that should be preserved
function getWelcomeMessage() {
    return 'Welcome to the application';
}

// TODO: This is the existing code that needs to be preserved

// Adding lang attribute to HTML element
app.use((req, res, next) => {
    res.locals.lang = 'en'; // Assuming English is the default language
    res.header('Content-Language', 'en');
    next();
});

// Fixing table structure issues
app.use((req, res, next) => {
    // Assuming res.locals.html is a string containing the HTML response body
    const html = res.locals.html;
    // A simple regex pattern to find tables in HTML
    const tablePattern = /<table.*?>.*?<\/table>/gis;
    // Replace existing tables with a more structured version
    const structuredTablePattern = /<table.*?>/gi;
    const endTablePattern = /<\/table>/gi;
    const structuredHtml = html.replace(structuredTablePattern, '<table role="table"><tbody>');
    const finalHtml = structuredHtml.replace(endTablePattern, '</tbody></table>');
    res.locals.html = finalHtml;
    next();
});

// Adding/fixing landmark issues
app.use((req, res, next) => {
    // Assuming res.locals.html is a string containing the HTML response body
    const html = res.locals.html;
    // Regex patterns to find landmark elements
    const landmarkPattern = /<main.*?>/gi;
    const asidePattern = /<aside.*?>/gi;
    // Add role attributes to landmark elements
    const enhancedHtml = html.replace(landmarkPattern, '<main role="main">').replace(asidePattern, '<aside role="complementary">');
    res.locals.html = enhancedHtml;
    next();
});

// Ensuring unique landmarks
app.use((req, res, next) => {
    // Assuming res.locals.html is a string containing the HTML response body
    const html = res.locals.html;
    // Regex to find duplicate landmarks (e.g., <main> and <main>)
    const duplicateLandmarkPattern = /<([a-z]+)[^>]*>(?:<[^>]+>)*?<\/\1>/gi;
    // Remove duplicate landmarks
    const uniqueHtml = html.replace(duplicateLandmarkPattern, (match, p1) => `<${p1}>`);
    res.locals.html = uniqueHtml;
    next();
});

// Adding accessible names to SVGs
app.use((req, res, next) => {
    // Assuming res.locals.html is a string containing the HTML response body
    const html = res.locals.html;
    // Regex to find SVG elements without an alt attribute
    const svgPattern = /<svg[^>]*>/gi;
    const svgAltPattern = /<svg[^>]*>(?:<title>.*?)?<\/title>/gi;
    // Add alt attributes to SVG elements
    const finalHtml = html.replace(svgPattern, (match) => {
        return match.replace(svgAltPattern, '<title>Image description goes here</title>');
    });
    res.locals.html = finalHtml;
    next();
});

// Fixing fake link issues
app.use((req, res, next) => {
    // Assuming res.locals.html is a string containing the HTML response body
    const html = res.locals.html;
    // Regex to find fake links
    const fakeLinkPattern = /<a[^>]*>(.*?)<\/a>/gi;
    // Replace fake links with a nofollow attribute
    const finalHtml = html.replace(fakeLinkPattern, (match, p1) => `<a rel="nofollow" href="${match}">${p1}</a>`);
    res.locals.html = finalHtml;
    next();
});

// Export the app for testing
module.exports = app;

// Start server if run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}