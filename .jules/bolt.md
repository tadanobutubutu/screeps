## Performance Optimizations

### Loop Iteration over `forEach`
In high-frequency array iteration (such as source or path loops in Screeps, or visualizer routines), replacing `Array.prototype.forEach()` with traditional indexed `for` loops eliminates the overhead of closure function allocations. This is particularly useful where performance and GC pressure are important considerations.

## 2026-08-07 - Loop Iteration over `forEach`
**Learning:** In high-frequency array iteration (such as source or path loops in Screeps, or visualizer routines), replacing `Array.prototype.forEach()` with traditional indexed `for` loops eliminates the overhead of closure function allocations. This is particularly useful where performance and GC pressure are important considerations.
**Action:** Replace `Array.prototype.forEach()` with traditional indexed `for` loops in high-frequency arrays.
