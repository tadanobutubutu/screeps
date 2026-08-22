// Existing code (preserved)
// ...

// Import required module(s)
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Export new necessary function(s)
export function loadConfig(filePath) {
  const absolutePath = resolve(process.cwd(), filePath);
  return JSON.parse(readFileSync(absolutePath, 'utf8'));
}