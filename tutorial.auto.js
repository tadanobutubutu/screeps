/**
 * Auto Tutorial System
 */

const logger = require('./utils.logging');

const autoTutorial = {
    isTutorial: function () {
        return !!(global.Game && global.Game.tutorial && global.Game.tutorial.currentStep);
    },

    run: function () {
        if (!this.isTutorial()) {
            return false;
        }
        this.autoStep();
        return true;
    },

    showProgress: function () {
        if (!this.isTutorial()) return;
        const step = global.Game.tutorial.currentStep;
        logger.info(`Tutorial Step: ${step}`);
    },

    skipIfPossible: function () {
        if (global.Game && global.Game.tutorial && typeof global.Game.tutorial.skip === 'function') {
            global.Game.tutorial.skip();
            return true;
        }
        return false;
    },

    step1_createHarvester: function () {
        const spawn = Object.values(global.Game.spawns || {})[0];
        if (spawn && typeof spawn.spawnCreep === 'function') {
            spawn.spawnCreep(['work', 'carry', 'move'], 'Harvester1', { memory: { role: 'harvester' } });
        }
    },

    step2_harvestEnergy: function () {
        // Step 2 logic
    },

    step3_upgradeController: function () {
        // Step 3 logic
    },

    step4_buildExtension: function () {
        // Step 4 logic
    },

    step5_defendRoom: function () {
        // Step 5 logic
    },

    autoStep: function () {
        if (!this.isTutorial()) return;
        const step = global.Game.tutorial.currentStep || 0;
        switch (step) {
            case 1:
                this.step1_createHarvester();
                break;
            case 2:
                this.step2_harvestEnergy();
                break;
            case 3:
                this.step3_upgradeController();
                break;
            case 4:
                this.step4_buildExtension();
                break;
            case 5:
                this.step5_defendRoom();
                break;
            default:
                break;
        }
    },
};

module.exports = autoTutorial;
