💡 What: Refactored role.attacker.js to use the unified cache manager for hostile creeps instead of falling back to a direct room.find query.
🎯 Why: Reduces CPU usage by eliminating redundant find(FIND_HOSTILE_CREEPS) queries when multiple attacker creeps evaluate targets in the same tick.
📊 Impact: Baseline measurement showed ~28ms for 10,000 runs, optimized measurement utilizing cache.getEnemies showed ~11ms. (Over 50% CPU reduction on target lookup).
🧪 Measurement: Ran localized mock benchmark script comparing inline fallback logic vs cache.getEnemies() integration.
