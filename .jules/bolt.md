## 2024-05-24 - Optimize deploy file reading
- Replaced sequential `for...of` loop with `await Promise.all()` and `map()` for reading deploy files to parallelize I/O operations and speed up deployment.
