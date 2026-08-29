// main.js
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
export function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  const uniqueLandmarks = [];
  
  for (const landmark of landmarks) {
    if (landmark && typeof landmark.id !== 'undefined') {
      if (!seen.has(landmark.id)) {
        seen.add(landmark.id);
        uniqueLandmarks.push(landmark);
      }
    } else if (!seen.has(landmark)) {
      seen.add(landmark);
      uniqueLandmarks.push(landmark);
    }
  }
  
  return uniqueLandmarks;
}

// ... rest of the code ...