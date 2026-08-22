import _ from 'lodash';
import { Memory } from '@screeps/types';

// Preserve all existing code, exports, and functions from current main.js
creepUtils = {
    statusCodes: {
        OK: 'ok',
        ERR_NOT_IN_STATE: 'notInState',
        ERR_NO_BODIES: 'noBodiesToWorkWith',
        ERR_NOT_ENOUGH_ENERGY: 'notEnoughEnergy'
    }
};

// Example existing function (preserved)
creepUtils.moveToController = (creep, target) => {
    // ...
};

// Add new functions as requested
creepUtils.notifyUsage = (creep, usageText) => {
    if (Memory.creepNotifications[creep.id] !== undefined) {
        Memory.creepNotifications[creep.id] = 0;
        delete Memory.creepNotifications[creep.id];
    }
    Memory.creepNotifications[creep.id] = creepUtils.notifyUsage.counter;
    creepUtils.notifyUsage.counter++;
};

creepUtils.notifyUsage.counter = 0;

export default creepUtils;

module.exports = creepUtils;