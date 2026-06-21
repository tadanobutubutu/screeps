TaskQueue.registerTask(
    'memVisCleanup',
    200,
    () => {
        memVis.cleanup();
        utilsMemory.cleanCache();
    },
    () => adaptiveSystem.isEnabled('memoryVisualizer')
);

TaskQueue.registerTask(
    'memVisBackup',
    2000,
    () => memVis.backup(),
    () => adaptiveSystem.isEnabled('memoryVisualizer')
);

TaskQueue.registerTask(
    'gamificationMilestones',
    100,
    () => gamification.checkMilestones(),
    () => adaptiveSystem.isEnabled('gamification')
);

TaskQueue.registerTask(
    'gamificationDashboard',
    1,
    () => gamification.renderDashboard(),
    () => adaptiveSystem.isEnabled('gamification')
);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Social interaction logic extracted to reduce main loop complexity.
 */
function handleSocialInteractions(rooms) {
    if (!adaptiveSystem.isEnabled('socialInteractions') || Game.time % 100 !== 0) {
        return;
    }

    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const creepsInRoom = room._myCreeps || room.find(FIND_MY_CREEPS);

        for (let j = 0; j < creepsInRoom.length; j++) {
            const creep = creepsInRoom[j];
            for (let k = j + 1; k < creepsInRoom.length; k++) {
                const neighbor = creepsInRoom[k];
                if (
                    Math.max(
                        Math.abs(creep.pos.x - neighbor.pos.x),
                        Math.abs(creep.pos.y - neighbor.pos.y)
                    ) <= 1
                ) {
                    if (Math.random() > 0.7) {
                        EmotionSystem.interact(creep, neighbor);
                    }
                }
            }
        }
    }
}

\n    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }

    // Smart Spawn Priority (Auto-added)
    if (!Memory.spawnPriority) {
        Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer'];
    }
    // Auto-adjust priority based on current needs
    if (Game.time % 500 === 0) {
        const counts = {};
        Object.values(Game.creeps).forEach(c => {
            counts[c.memory.role] = (counts[c.memory.role] || 0) + 1;
        });
        Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
    }

    // Path Cache Cleanup (Auto-added)
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache).filter(
            (key) => Memory.pathCache[key].tick < Game.time - 1000
        );
        oldPaths.forEach((key) => delete Memory.pathCache[key]);
        if (oldPaths.length > 0) {
            }
    }

    try {
        const rooms = (global._rooms = Object.values(Game.rooms || {}));
        const creeps = (global._creeps = Object.values(Game.creeps || {}));
        const spawns = (global._spawns = Object.values(Game.spawns || {}));
        const constructionSites = (global._constructionSites = Object.values(
            Game.constructionSites || {}
        ));

        if (spawns.length > 0) {
            global._primarySpawn = spawns[0];
            global._primarySpawnTick = Game.time;
        }

        adaptiveSystem.evaluate();

        if (Game.time % 100 === 0) {
            utilsMemory.cleanMemory();
        }

        if (adaptiveSystem.isEnabled('tutorial') && autoTutorial.isTutorial()) {
            autoTutorial.run();
            autoTutorial.showProgress();
            return;
        }

        TaskQueue.run();

        const isLoggingEnabled = adaptiveSystem.isEnabled('logging');
        const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects');
        const isAdvancedRolesEnabled = adaptiveSystem.isEnabled('advancedRoles');
        const isEmotionsEnabled = adaptiveSystem.isEnabled('emotions');

        const targetCreeps = isAdvancedRolesEnabled ? TARGET_CREEPS_ADVANCED : TARGET_CREEPS_NORMAL;

        const creepCounts = processCreeps(
            rooms,
            creeps,
            constructionSites,
            isLoggingEnabled,
            isEmotionsEnabled
        );

        if (Game.time % 1000 === 0 && adaptiveSystem.isEnabled('autoEvolution')) {
            autoEvolution.run();
        }

        for (let i = 0; i < spawns.length; i++) {
            handleSpawning(spawns[i], creepCounts, targetCreeps, isLoggingEnabled);
        }

        handleSocialInteractions(rooms);
        handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled);

        if (Game.time % 100 === 0) {
            displayStats(creeps);
        }
    } catch (e) {
        Sentry.captureException(e);
        const safeStack = logger.getSafeStack(e.stack);
        logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\n' + safeStack : ''));
    }
};

// ⚡ PERFORMANCE: Hoisted default body configuration to avoid per-call array allocation.
const DEFAULT_BODY_CONFIG = [[MOVE, WORK, CARRY], 200];
const DEFAULT_BODY_PARTS = [MOVE, WORK, CARRY];

function getBodyForRole(role, energy) {
    const bodyConfig = BODY_CONFIGS[role] || DEFAULT_BODY_CONFIG;

    if (energy >= bodyConfig[1]) {
        return bodyConfig[0];
    }

    return DEFAULT_BODY_PARTS;
}

// ==============================================
// ⌨️ CONSOLE COMMANDS
// ==============================================

// ⚡ Adaptive System
global.adaptive = adaptiveSystem.showDashboard.bind(adaptiveSystem);
global.mode = adaptiveSystem.setMode.bind(adaptiveSystem);

// 😊 Emotion commands
global.e = EmotionSystem.getStats.bind(EmotionSystem);
global.ec = EmotionSystem.checkCreep.bind(EmotionSystem);

// 💾 Memory commands
global.m = memVis.showStats.bind(memVis);
global.mh = memVis.showHistory.bind(memVis);
global.ml = memVis.showLeaderboard.bind(memVis);
global.md = memVis.readDiary.bind(memVis);
global.mm = memVis.showMap.bind(memVis);
global.mc = memVis.cleanup.bind(memVis);
global.mb = memVis.backup.bind(memVis);
global.mr = memVis.restore.bind(memVis);

// 🎮 Tutorial commands
global.t = autoTutorial.showProgress.bind(autoTutorial);
global.ts = autoTutorial.skipIfPossible.bind(autoTutorial);

// ✨ Gamification commands
global.g = gamification.showDashboard.bind(gamification);
global.gr = gamification.reset.bind(gamification);

// 🤖 Auto Evolution commands
global.evo = autoEvolution.showDashboard.bind(autoEvolution);
global.evor = autoEvolution.reset.bind(autoEvolution);

// Helper function
global.help = function () {
    - system dashboard');
    - force mode (0=EMERGENCY, 1=MINIMAL, 2=NORMAL, 3=FULL)');
    - emotion stats');
    - check creep');
    - memory stats');
    - history');
    - leaderboard');
    - cleanup');
    - dashboard');
    - dashboard');
};

if (!Memory.helpShown) {
    Memory.helpShown = true;
    global.help();
}
