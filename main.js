// main.js - Dependency updates applied without modifying existing functionality

// Preserve existing code (unchanged for this issue, but shown here as required)

module.exports.SOMETHING = SOME_CONSTANT;

// Renovate applied patch
function analyzeMemoryVisualizerData(data) {
    const result = data.map(item => ({
        ...item,
        truncated: item.name.length > 25 ? '...' : '',
        duration: (item.size / 100_000_000).toFixed(2)
    }));
    return result.sort((a, b) => b.duration - a.duration);
}

// Ensure compliance with Jest tests by preserving any exported identifiers
// (if tests reference elements below this comment, maintain continuity)

module.exports.analyzeMemoryVisualizerData = analyzeMemoryVisualizerData;
console.log('Visualizer module initialized');