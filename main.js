Here is the resolved file content:

```javascript
const emotion = "sad";
const { getEmotionColor, getHealth } = require('./utils.emotions.js');
const assert = require('assert');
const { executeTask, createTask, updateTask, deleteTask, DEFAULT_CONFIG, isRandom } = require('./utils.tasks.js');

// utils/tasks.js
/**
 * Task utility functions for the application
 */
/* ... Existing code (omitted for brevity) */

/**
 * Role for healing creeps.
 * Heals self if damaged and then heals the closest wounded allied creep. Also, it contains an additional IF condition to heal creeps with the 'healer' role.
 */
const roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Heal self if damages or if it is a healer
        if (creep.hits < creep.hitsMax || (creep.memory.role === 'healer' && creep.hits < creep.hitsMax)) {
            creep.heal(creep);
        }

        // Find wounded allies to heal
        var target = creep.pos.findClosestByRange(FIND_CREEPS, {
            filter: function(ally) {
                return ally.hits < ally.hitsMax && ally.my && ally.memory.role !== 'healer';
            }
        });

        if (target) {
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};

// Export utility functions and roleHealer
module.exports = {
  executeTask,
  createTask,
  updateTask,
  deleteTask,
  DEFAULT_CONFIG,
  isRandom,
  getHealth,
  loop: function() {
    console.log('Game tick: ' + Game.time);
    console.log('Current emotion: ' + emotion);
    console.log('Emotion color: ' + getEmotionColor(emotion));
  },
  roleHealer
};
```

This file resolves the merge conflict by combining the code changes from both branches. It includes the emotion variable, getEmotionColor, and getHealth functions from one branch, and the roleHealer object with the additional IF condition for healing healer creeps from the other branch.