// main.js

const fs = require('fs');
const path = require('path');

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath || !outputPath) {
    console.error('Usage: node main.js <input-file> <output-file>');
    process.exit(1);
  }

  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');

  const processedLines = lines.map(line => {
    return line.trim();
  });

  fs.writeFileSync(outputPath, processedLines.join('\n'), 'utf-8');

  console.log(`Processed ${lines.length} lines`);
}

module.exports = { main };

main();