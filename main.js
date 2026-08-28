function main() {
 const fs = require('fs');
 const path = require('path');

 /**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
 function setSvgAccessibilityProps(svgElement) {
 const accessibleName = svgElement.querySelector('title')?.textContent?.trim() || 'SVG graphic';
 if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
 svgElement.setAttribute('aria-label', accessibleName);
 }
 }

 /**
 * Checks if a table has the expected structure
 * @param {string} tableName - The name of the table to check
 * @param {Array<string>} expectedColumns - Array of expected column names
 * @returns {boolean} - True if table structure matches expected columns, false otherwise
 */
 function checkTableStructure(tableName, expectedColumns) {
 // Validation code removed for conflict resolution purposes
 // Code from both versions merged and refactored for better encapsulation and simplification
 if (!tableName || typeof tableName !== 'string') {
 return false;
 }

 if (!Array.isArray(expectedColumns)) {
 return false;
 }

 if (expectedColumns.length === 0) {
 return false;
 }

 for (const expectedCol of expectedColumns) {
 const existingCol = tableName.querySelector(`[data-column="${expectedCol}"]`);
 if (!existingCol) {
 return false;
 }
 }

 return true;
 }

 /**
 * Validates table structure matches expected schema
 * @param {Object} tableSchema - The table schema object
 * @param {Object} expectedSchema - The expected schema object
 * @returns {Object} - Result object with isValid boolean and errors array
 */
 function validateTableSchema(tableSchema, expectedSchema) {
 const errors = [];

 if (!tableSchema || typeof tableSchema !== 'object') {
 errors.push('Invalid table schema provided');
 return { isValid: false, errors };
 }

 if (!expectedSchema || typeof expectedSchema !== 'object') {
 errors.push('Invalid expected schema provided');
 return { isValid: false, errors };
 }

 const tableColumns = tableSchema.columns || [];
 const expectedColumns = expectedSchema.columns || [];

 if (tableColumns.length !== expectedColumns.length) {
 errors.push(`Column count mismatch: expected ${expectedColumns.length}, got ${tableColumns.length}`);
 }

 expectedColumns.forEach((expectedCol) => {
 const found = tableColumns.find((col) => col.name === expectedCol.name);
 if (!found) {
 errors.push(`Missing expected column: ${expectedCol.name}`);
 } else if (expectedCol.type && found.type !== expectedCol.type) {
 errors.push(`Column ${expectedCol.name} type mismatch: expected ${expectedCol.type}, got ${found.type}`);
 }
 });

 return {
 isValid: errors.length === 0,
 errors
 };
 }

 // Code from original versions preserved here:

 // ...

 // Existing code that should be preserved
 function existingFunction() {
 // ... existing code ...
 }

 // Existing exports that should be preserved
 export function existingExport() {
 // ... existing code ...
 }

 // New function created to address new requirement
 function checkTables(tablesObject, expectedSchemas) {
 const invalidTables = [];

 for (const tableName in tablesObject) {
 if (!tablesObject.hasOwnProperty(tableName)) continue;

 const table = tablesObject[tableName];
 const expectedSchema = expectedSchemas[tableName];

 const { isValid, errors } = validateTableSchema(table, expectedSchema);

 if (!isValid) {
 errors.forEach((err) => console.error(`Table ${tableName}: Invalid schema:`, err));
 invalidTables.push(tableName);
 }
 }

 return invalidTables;
 }

 module.exports = {
 setSvgAccessibilityProps,
 checkTableStructure,
 validateTableSchema,
 checkTables
 };