// @ts-check
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCREEP_SRC = path.join(__dirname, 'src');
const BUILD_DIST = path.join(__dirname, 'dist');

function buildScreep(code) {
  const output = code
    // Remove types
    .replace(/:\s*(string|number|boolean|void|any|object|never|null|undefined|unknown|never)/g, '')
    .replace(/<[A-Z][a-zA-Z]*>/g, 'any')
    // Arrow functions are fine
    // Template strings are fine
    // Object spread is fine
    // Classes are fine
    // Remove type annotations
    .replace(/\bas\s+\w+/g, '')
    // Remove 'this' parameter from arrow functions
    .replace(/\(\s*this\s*\)/g, '()')
    // Remove decorators
    .replace(/@\w+\s*/g, '')
    // Remove 'as' type assertions
    .replace(/\s+as\s+\w+(<[^>]+>)?/g, '')
    // Remove interface declarations
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    // Remove type declarations
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
    // Remove readonly modifiers
    .replace(/\breadonly\s+/g, '')
    // Remove generic type parameters from functions
    .replace(/<[A-Za-z_][A-Za-z0-9_]*>/g, '')
    // Remove enum declarations
    .replace(/enum\s+\w+\s*\{[^}]*\}/g, '')
    // Remove import type statements
    .replace(/import\s+type\s+.*?from\s+['"].*?['"]/g, '')
    // Remove namespace references
    .replace(/\w+\.\w+\s*=/g, '')
    // Fix 'this' binding in class methods
    .replace(/^\s*constructor\s*\([^)]*\)\s*\{([^}]*this\.\w+\s*=[^;]+;[^}]*)\}/m, (match, body) => {
      return `constructor(${match.split('(')[1].split(')')[0]}) {${body}}`;
    })
    // Remove 'declare' keyword
    .replace(/\bdeclare\s+/g, '')
    // Remove 'export' from non-module contexts (Screeps doesn't support ES modules)
    .replace(/^export\s+/gm, '')
    // Remove 'require' calls that aren't assigned
    .replace(/const\s+\w+\s*=\s*require\(['"][^'"]+['"]\);/g, '')
    // Remove 'export default'
    .replace(/export\s+default\s+/g, '')
    // Remove abstract keyword
    .replace(/\babstract\s+/g, '')
    // Remove 'implements' clause
    .replace(/\s+implements\s+[\w,\s]+/g, '')
    // Remove 'private', 'public', 'protected' keywords
    .replace(/\b(private|public|protected)\s+/g, '')
    // Remove 'override' keyword
    .replace(/\boverride\s+/g, '');

  return output;
}

function compileFile(filePath) {
  const ext = path.extname(filePath);
  
  if (ext === '.js' || ext === '.ts') {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
      return buildScreep(content);
    } catch (e) {
      console.error(`Error processing ${filePath}: ${e.message}`);
      return content;
    }
  }
  
  return null;
}

function build() {
  // Clean build directory
  if (fs.existsSync(BUILD_DIST)) {
    fs.rmSync(BUILD_DIST, { recursive: true });
  }
  fs.mkdirSync(BUILD_DIST, { recursive: true });

  // Process all TypeScript/JavaScript files
  function processDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDir(filePath);
      } else {
        const result = compileFile(filePath);
        if (result !== null) {
          const relativePath = path.relative(SCREEP_SRC, filePath);
          const outputPath = path.join(BUILD_DIST, relativePath);
          const outputDir = path.dirname(outputPath);
          
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          fs.writeFileSync(outputPath, result);
        }
      }
    }
  }

  processDir(SCREEP_SRC);
  console.log('Build complete!');
}

// Run build
build();