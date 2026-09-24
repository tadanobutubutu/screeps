# Performance Improvements

In room construction planning routines (`_planRoads`), iterating through a long path and repeatedly looping through cached arrays of structures and sites for every tile coordinates caused high CPU overhead (O(PathLength * Structures/Sites)).

## 2026-08-25 - Throttling Visual Intent Calls and Hoisting Memory Keys in Creep Roles
**Learning:** Calling creep.say() on every tick during high-frequency routines (e.g. RCL8 upgrader operations) adds unnecessary Screeps engine intent overhead. Throttling visual intents and hoisting invariant memory keys to module scope reduces tick CPU cost.
**Action:** Throttle non-critical visual intents like creep.say() with tick modulo checks and hoist static memory keys to module scope.

## 2026-08-25 - Eliminating Closure Allocations in Spawn Manager Body Cost Calculations
**Learning:** In Screeps high-frequency spawn routines (`_calcBodyCost`), replacing `Array.prototype.reduce` with a standard indexed `for` loop eliminates callback closure allocations and method dispatch overhead per call.
**Action:** Prefer indexed `for` loops over `Array.prototype.reduce` in spawn evaluation routines.
