## 2025-02-18

**Title:** Optimizing Creep Pair Distance Checking in main loop
**Learning:** `pos.findInRange` calls inside nested loops (`O(N^2)`) over `rooms` create massive overhead. Because the full list of creeps is already fetched for the room (`_myCreeps`), iterating over unique pairs locally (`k = j + 1`) and computing Chebyshev distance (`Math.max(Math.abs(dx), Math.abs(dy)) <= 1`) completely avoids engine-level calls, `Set` allocations, and string operations.
**Action:** Replaced `findInRange` and `processedPairs` Set with an optimized `j`/`k` nested array loop in `handleSocialInteractions`.
