const fs = require('fs');
const path = require('path');

/**
 * Fix REACT_017: Add <main> landmark to pages for accessibility
 * This fixes the "Page has no <main> landmark" warning
 */

const FIXES = [
  {
    file: 'app/layout.tsx',
    pattern: /<body>\{children\}<\/body>/,
    replacement: '<body><main>{children}</main></body>'
  },
  {
    file: 'dashboard/app/layout.tsx',
    pattern: /<body>\{children\}<\/body>/,
    replacement: '<body><main>{children}</main></body>'
  }
];

function fixFile(filePath, pattern, replacement) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!pattern.test(content)) {
      console.log(`⚠️  Pattern not found in: ${filePath}`);
      return false;
    }
    
    const newContent = content.replace(pattern, replacement);
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing REACT_017: Adding <main> landmarks...\n');
  
  let fixedCount = 0;
  
  FIXES.forEach(({ file, pattern, replacement }) => {
    if (fixFile(file, pattern, replacement)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Fixed ${fixedCount}/${FIXES.length} files`);
  
  if (fixedCount === FIXES.length) {
    console.log('✨ All React Landmarks fixes applied successfully!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, FIXES };