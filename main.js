// main.js

const http = require('http');
const https = require('https');
const url = require('url');

/**
 * Parses command line arguments
 */
function parseArgs(args) {
    const result = {
        urls: []
    };
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--output' || args[i] === '-o') {
            result.output = args[++i];
        } else if (args[i] === '--verbose' || args[i] === '-v') {
            result.verbose = true;
        } else if (!args[i].startsWith('-')) {
            result.urls.push(args[i]);
        }
    }
    
    return result;
}

/**
 * Reads file contents
 */
function readFile(filePath) {
    const fs = require('fs');
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return null;
    }
}

/**
 * Writes content to file
 */
function writeFile(filePath, content) {
    const fs = require('fs');
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Extracts links from markdown content
 */
function extractLinks(markdown) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(markdown)) !== null) {
        links.push({
            text: match[1],
            href: match[2]
        });
    }
    
    return links;
}

// TODO: Implement this function for checking link accessibility
async function checkLinkAccessibility(link) {
    try {
        const parsedUrl = new URL(link);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        return new Promise((resolve) => {
            const request = protocol.request(link, { 
                method: 'HEAD',
                timeout: 10000
            }, (response) => {
                const isAccessible = response.statusCode >= 200 && response.statusCode < 400;
                resolve({
                    link,
                    accessible: isAccessible,
                    statusCode: response.statusCode,
                    error: null
                });
            });
            
            request.on('error', (error) => {
                resolve({
                    link,
                    accessible: false,
                    statusCode: null,
                    error: error.message
                });
            });
            
            request.on('timeout', () => {
                request.destroy();
                resolve({
                    link,
                    accessible: false,
                    statusCode: null,
                    error: 'Request timed out'
                });
            });
            
            request.end();
        });
    } catch (error) {
        return {
            link,
            accessible: false,
            statusCode: null,
            error: error.message
        };
    }
}

/**
 * Checks all links in a markdown file
 */
async function checkLinksInFile(filePath) {
    const content = readFile(filePath);
    if (!content) {
        return { error: 'Could not read file' };
    }
    
    const links = extractLinks(content);
    const results = [];
    
    for (const link of links) {
        const result = await checkLinkAccessibility(link.href);
        results.push({
            ...result,
            text: link.text
        });
    }
    
    return {
        file: filePath,
        links: results,
        summary: {
            total: results.length,
            accessible: results.filter(r => r.accessible).length,
            inaccessible: results.filter(r => !r.accessible).length
        }
    };
}

module.exports = {
    parseArgs,
    readFile,
    writeFile,
    extractLinks,
    checkLinkAccessibility,
    checkLinksInFile
};