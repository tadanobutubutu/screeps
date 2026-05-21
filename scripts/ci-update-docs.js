#!/usr/bin/env node
/**
 * CircleCI Auto Documentation Generator
 * ロールファイルからドキュメントを自動生成
 */
const fs = require('fs');
const path = require('path');

// Find all role files
const files = fs.readdirSync('.').filter(f => f.startsWith('src.roles.') && f.endsWith('.js'));
if (files.length === 0) {
  console.log('No role files found, skipping docs update');
  process.exit(0);
}

// Ensure docs directory exists
if (!fs.existsSync('docs')) {
  fs.mkdirSync('docs', { recursive: true });
}

let docs = '# 🤖 Screeps AI Roles Reference\n\n';
docs += `*Auto-generated: ${new Date().toISOString()}*\n\n---\n\n`;

files.sort().forEach(file => {
  const roleName = file.replace('src.roles.', '').replace('.js', '');
  const content = fs.readFileSync(file, 'utf8');

  docs += `## ${roleName}\n\n`;
  docs += `**File**: \`${file}\`\n\n`;

  // Extract description from JSDoc comments
  const descMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (descMatch) {
    const desc = descMatch[1].replace(/^\s*\*\s?/gm, '').trim();
    docs += `${desc}\n\n`;
  }

  docs += '---\n\n';
});

fs.writeFileSync('docs/ROLES_REFERENCE.md', docs);
console.log(`✅ Generated docs for ${files.length} roles`);
