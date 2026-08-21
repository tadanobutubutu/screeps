// Fix for REACT_027: React Table Structure - Add scope attributes to <th> elements

import fs from 'fs';
import path from 'path';

/**
 * Determines if a <th> element should have scope="col" or scope="row"
 * Based on context: first row = col headers, first column = row headers
 */
function determineScope(thContent, rowIndex, isFirstInRow, totalCols, totalRows) {
  // If it's the first cell in the first row, it's likely a corner cell or column header
  if (rowIndex === 0 && isFirstInRow) {
    // Check if there are more columns after - if so, likely a row header
    const nextThMatch = thContent.match(/<th[^>]*>[\s\S]*?<\/th>/);
    if (nextThMatch) {
      return 'row';
    }
    return 'col';
  }
  
  // First row elements get scope="col"
  if (rowIndex === 0) {
    return 'col';
  }
  
  // First column elements get scope="row"
  if (isFirstInRow) {
    return 'row';
  }
  
  // Default for header cells in data area
  return 'col';
}

/**
 * Adds scope attribute to <th> elements in content
 */
function addScopeToThElements(content) {
  // Match <th> tags with their content
  const thPattern = /<th(\s[^>]*)?>([\s\S]*?)<\/th>/gi;
  const trPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  
  let result = content;
  let rowIndex = 0;
  
  // Process content to find table rows
  const trMatches = content.match(trPattern) || [];
  
  trMatches.forEach((trContent, idx) => {
    let processedTr = trContent;
    let colIndex = 0;
    
    processedTr = processedTr.replace(thPattern, (match, attrs, innerContent) => {
      const hasScope = attrs && attrs.includes('scope=');
      
      if (hasScope) {
        return match; // Already has scope, don't modify
      }
      
      const isFirstInRow = colIndex === 0;
      const scope = determineScope(match, rowIndex, isFirstInRow, 
        (trContent.match(/<th/g) || []).length, trMatches.length);
      
      colIndex++;
      
      // Build new attribute string
      const newAttrs = attrs ? `${attrs.trim()} scope="${scope}"` : ` scope="${scope}"`;
      return `<th${newAttrs}>${innerContent}</th>`;
    });
    
    result = result.replace(trContent, processedTr);
    rowIndex++;
  });
  
  return result;
}

/**
 * Main function to fix React Table Structure issues
 */
export default async function main() {
  const files = process.argv.slice(2);
  
  if (files.length === 0) {
    return "Usage: node main.js <file1> <file2> ...";
  }
  
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const fixedContent = addScopeToThElements(content);
      
      if (content !== fixedContent) {
        fs.writeFileSync(file, fixedContent);
        fixedCount++;
        console.log(`Fixed: ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }
  
  return `Fixed ${fixedCount} file(s) with REACT_027 issues (added scope attributes to <th> elements)`;
}