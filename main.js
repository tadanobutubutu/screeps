// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

// Existing exports (preserved)
export function getValue() {
  return 42;
}

export function processItem(item) {
  return item * 2;
}

// Missing exports to add
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}
export function formatString(text) {
  return text.toUpperCase();
}
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}