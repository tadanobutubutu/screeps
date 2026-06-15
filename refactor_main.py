import sys

with open("main.js", "r") as f:
    content = f.read()

# Refactor processCreeps (around line 362)
old_process_creeps = """function processCreeps(rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
    const creepCounts = Object.create(null);

    // ⚡ PERFORMANCE: 部屋ごとのキャッシュ初期化と構造物のスキャンを一括で行う
    for (let i = 0; i < rooms.length; i++) {
        warmRoomCache(rooms[i]);
    }

    // ⚡ PERFORMANCE: 建設サイトの処理
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (site.my && site.room) {
            site.room._myConstructionSites.push(site);
        }
    }

    // Pass 1: データ収集
    // ⚡ PERFORMANCE: 以前の creepsToProcess 配列の作成を回避し、
    // 中間オブジェクトの割り当てをなくす。
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        const memory = creep.memory;
        let role = memory.role;

        if (role === undefined || role === null) {
            role = memory.role = 'harvester';
            if (isLoggingEnabled) {
                logger.warn('Creep ' + creep.name + ' had no role, set to harvester');
            }
        }
        // ⚡ PERFORMANCE: Cache role as a volatile property to avoid second Proxy lookup in Pass 2.
        creep._role = role;
        creepCounts[role] = (creepCounts[role] || 0) + 1;

        const room = creep.room;
        if (room) {
            room._myCreeps.push(creep);
            if (room._roleCounts[role] !== undefined) {
                room._roleCounts[role]++;
            }
            if (creep.hits < creep.hitsMax) {
                room._injuredCreeps.push(creep);

                // ⚡ PERFORMANCE: Hoist critical creep detection (hits < 50%)
                // This avoids redundant per-tower searches in defense.manager.js.
                if (!room._criticalCreep && creep.hits < creep.hitsMax * 0.5) {
                    room._criticalCreep = creep;
                }
            }
            if (role === 'defender') {
                room._defenders.push(creep);
            }
        }
    }

    // Pass 2: ロジック実行
    // ⚡ PERFORMANCE: 収集完了後（部屋の統計が揃った状態）でロジックを実行。
    const processFn = isLoggingEnabled ? runCreepWithLogging : runCreepMinimal;

    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        processFn(creep, creep._role, creep.name, isEmotionsEnabled);
    }

    return creepCounts;
}"""

new_functions = """function categorizeConstructionSites(sites) {
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (site.my && site.room) {
            site.room._myConstructionSites.push(site);
        }
    }
}

function collectCreepData(creeps, creepCounts, isLoggingEnabled) {
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        const memory = creep.memory;
        let role = memory.role;

        if (role === undefined || role === null) {
            role = memory.role = 'harvester';
            if (isLoggingEnabled) {
                logger.warn('Creep ' + creep.name + ' had no role, set to harvester');
            }
        }
        creep._role = role;
        creepCounts[role] = (creepCounts[role] || 0) + 1;

        const room = creep.room;
        if (room) {
            room._myCreeps.push(creep);
            if (room._roleCounts[role] !== undefined) {
                room._roleCounts[role]++;
            }
            if (creep.hits < creep.hitsMax) {
                room._injuredCreeps.push(creep);
                if (!room._criticalCreep && creep.hits < creep.hitsMax * 0.5) {
                    room._criticalCreep = creep;
                }
            }
            if (role === 'defender') {
                room._defenders.push(creep);
            }
        }
    }
}

function executeCreepLogic(creeps, isLoggingEnabled, isEmotionsEnabled) {
    const processFn = isLoggingEnabled ? runCreepWithLogging : runCreepMinimal;
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        processFn(creep, creep._role, creep.name, isEmotionsEnabled);
    }
}

function processCreeps(rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
    const creepCounts = Object.create(null);

    for (let i = 0; i < rooms.length; i++) {
        warmRoomCache(rooms[i]);
    }

    categorizeConstructionSites(sites);
    collectCreepData(creeps, creepCounts, isLoggingEnabled);
    executeCreepLogic(creeps, isLoggingEnabled, isEmotionsEnabled);

    return creepCounts;
}"""

if old_process_creeps in content:
    content = content.replace(old_process_creeps, new_functions)
else:
    print("processCreeps not found")

# Refactor module.exports.loop (around line 661)
old_loop = """module.exports.loop = function () {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
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

        const targetCreepEntries = isAdvancedRolesEnabled ? TARGET_CREEPS_ADVANCED_ENTRIES : TARGET_CREEPS_NORMAL_ENTRIES;

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
            handleSpawning(spawns[i], creepCounts, targetCreepEntries, isLoggingEnabled);
        }

        handleSocialInteractions(rooms);
        handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled);

        if (Game.time % 100 === 0) {
            displayStats(creeps);
        }
    } catch (e) {
        Sentry.captureException(e);
        const safeStack = logger.getSafeStack(e.stack);
        logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));
    }
};"""

loop_helpers = """function handleMemoryCleanup() {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        Memory.lastCleanup = Game.time;
    }
}

function adjustSpawnPriority() {
    if (!Memory.spawnPriority) {
        Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer'];
    }
    if (Game.time % 500 === 0) {
        const counts = {};
        for (const name in Game.creeps) {
            const c = Game.creeps[name];
            counts[c.memory.role] = (counts[c.memory.role] || 0) + 1;
        }
        Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
    }
}

function cleanupPathCache() {
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache).filter(
            (key) => Memory.pathCache[key].tick < Game.time - 1000
        );
        oldPaths.forEach((key) => delete Memory.pathCache[key]);
    }
}

function runMainTick() {
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

    const targetCreepEntries = isAdvancedRolesEnabled ? TARGET_CREEPS_ADVANCED_ENTRIES : TARGET_CREEPS_NORMAL_ENTRIES;

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
        handleSpawning(spawns[i], creepCounts, targetCreepEntries, isLoggingEnabled);
    }

    handleSocialInteractions(rooms);
    handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled);

    if (Game.time % 100 === 0) {
        displayStats(creeps);
    }
}

module.exports.loop = function () {
    handleMemoryCleanup();
    adjustSpawnPriority();
    cleanupPathCache();

    try {
        runMainTick();
    } catch (e) {
        Sentry.captureException(e);
        const safeStack = logger.getSafeStack(e.stack);
        logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));
    }
};"""

if old_loop in content:
    content = content.replace(old_loop, loop_helpers)
else:
    print("loop not found")

with open("main.js", "w") as f:
    f.write(content)
