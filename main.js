import fs from 'fs';
import path from 'path';

/**
 * Adds aria-hidden="true" to SVG elements that don't already have an accessible name attribute.
 * This fixes the REACT_041 accessibility rule for decorative SVG elements like favicons.
 */
export default async function main() {
  const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
  ];

  for (const filePath of filesToFix) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Pattern to find <svg> tags that don't already have aria-hidden or aria-label
      // This regex matches <svg> elements without aria-hidden="true" or aria-label
      const svgRegex = /<svg([^>]*?)>/gi;
      
      let modified = false;
      content = content.replace(svgRegex, (match, attributes) => {
        // Check if aria-hidden or aria-label already exists
        if (attributes.includes('aria-hidden') || attributes.includes('aria-label')) {
          return match; // Already has accessible name, skip
        }
        modified = true;
        // Add aria-hidden="true" to the SVG element
        return `<svg aria-hidden="true"${attributes}>`;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
      } else {
        console.log(`No changes needed: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }

  return 'SVG accessibility fixes applied successfully';