// TODO: This is the existing code that needs to be preserved

/**
 * Module for handling core functionality.
 * @module core
 */

// Existing exports and helper functions (preserve these exactly)
export const version = '1.0.0';

/**
 * Adds two numbers together.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The sum of a and b.
 */
export function add(a, b) {
  return a + b;
}

/**
 * Subtracts the second number from the first.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The difference a - b.
 */
export function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The product of a and b.
 */
export function multiply(a, b) {
  return a * b;
}

/**
 * Divides the first number by the second.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The quotient a / b.
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/*
 * Conflict marker start (preserve any pre‑existing conflict region)
<<<<<<< HEAD
export const config = {
  defaultLanguage: 'en',
  apiEndpoint: 'https://api.example.com',
};

/**
 * Validates an email address using a simple regex.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email appears valid, false otherwise.
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
=======
export const config = {
  defaultLanguage: 'en',
  apiEndpoint: 'https://api.example.com',
};

/**
 * Validates a phone number (simple digits and dashes check).
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if the phone number appears valid, false otherwise.
 */
export function isValidPhone(phone) {
  const re = /^[0-9\-+]+$/;
  return re.test(phone);
}
>>>>>>> feature/phone-validation
*/

// New utility functions requested in the issue

/**
 * Calculates the factorial of a non‑negative integer.
 * @param {number} n - The integer to calculate factorial for.
 * @returns {number} The factorial of n.
 */
export function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Factorial is defined for non‑negative integers only.');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Determines if a given string is a palindrome (case‑insensitive, ignores non‑alphanumeric characters).
 * @param {string} str - The string to check.
 * @returns {boolean} True if str is a palindrome, false otherwise.
 */
export function isPalindrome(str) {
  // Normalize: lower case and remove non‑alphanumeric characters
  const cleaned = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  const length = cleaned.length;
  for (let i = 0; i < Math.floor(length / 2); i++) {
    if (cleaned[i] !== cleaned[length - 1 - i]) {
      return false;
    }
  }
  return true;
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} min - Minimum value (inclusive).
 * @param {number} max - Maximum value (inclusive).
 * @returns {number} A random integer in the range [min, max].
 */
export function getRandomInt(min, max) {
  if (min > max) {
    throw new Error('min must be less than or equal to max.');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}