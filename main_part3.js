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
}

function handleSpawning(spawn, creepCounts, targetCreeps, isLoggingEnabled) {
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        const role = spawningCreep.memory.role;
        spawn.room.visual.text('🛠️' + role, spawn.pos.x + 1, spawn.pos.y, STYLE_SPAWN_TEXT);

        const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects');
        if (isVisualEffectsEnabled) {
            const progress =
                (spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime;
            vfx.progressBar(
                { x: spawn.pos.x, y: spawn.pos.y + 1, roomName: spawn.room.name },
                progress,
                1,
                'SPAWNING'
            );
        }

        if (isVisualEffectsEnabled && Game.time % 5 === 0) {
            vfx.stars(spawn.pos, 5);
        }

        return;
    }

    // ⚡ PERFORMANCE: Hoist energyAvailable to avoid redundant Proxy lookups in the role loop.
    const energyAvailable = spawn.room.energyAvailable;

    for (const [role, target] of Object.entries(targetCreeps)) {
        const current = creepCounts[role] || 0;

        if (current < target) {
            const newName = role + '_' + Game.time;
            const body = getBodyForRole(role, energyAvailable);

            if (body.length > 0) {
                const result = spawn.spawnCreep(body, newName, { memory: { role } });

                if (result === OK) {
                    if (isLoggingEnabled) {
                        logger.info('Spawning new ' + role + ': ' + newName);
                    }
                    creepCounts[role] = current + 1;

                    const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects');
                    if (isVisualEffectsEnabled) {
                        vfx.successExplosion(spawn.pos);
                    }
                    if (adaptiveSystem.isEnabled('gamification')) {
                        gamification.addXP(20, 'Spawned ' + role);
                    }

                    break;
                } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
                    if (isLoggingEnabled) {
                        logger.warn('Failed to spawn ' + role + ': ' + result);
                    }
                }
            }
            break;
        }
    }
}

function handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled) {
    if (adaptiveSystem.isEnabled('defense')) {
        // ⚡ PERFORMANCE: 引数で渡されたrooms配列を使用。
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            if (room.controller && room.controller.my) {
                if (isVisualEffectsEnabled) {
                    dashboard.displayVisuals(room);
                }

                const roomName = room.name;
                if (isLoggingEnabled) {
                    logger.tryCatch(runDefenseLogic, 'defense_' + roomName, room);
                } else {
                    try {
                        runDefenseLogic(room);
                    } catch (e) {
                        Sentry.captureException(e);
                        // Security: Use logging system for consistent escaping and error tracking.
                        logger.error('Error in defense ' + roomName + ': ' + e.message);
                    }
                }
            }
        }
    }
}

function _displayCoreStats(creeps) {
    ).toUpperCase()
    );
    .length));
    .toFixed(2) +
            '/' +
            Game.cpu.limit +
            ' (Bucket: ' +
            Game.cpu.bucket +
            ')'
    );
    .length / 1024).toFixed(1) + ' KB');
}

function _displayLogStats() {
    const logStats = logger.getStats();
    if (logStats.errors > 0) {
        logger.warn('Recent errors: ' + logStats.errors);
    }
}

function _displayEmotionStats() {
    const emotionStats = EmotionSystem.getStats();
    +
            ', Neutral: ' +
            emotionStats.neutral
    );
}

function _displayGamificationStats() {
    const gm = Memory.gamification;
    if (gm) {
        }
}

function displayStats(creeps) {
    _displayCoreStats(creeps);

    if (adaptiveSystem.isEnabled('logging')) {
        _displayLogStats();
    }

    if (adaptiveSystem.isEnabled('emotions')) {
        _displayEmotionStats();
    }

    if (adaptiveSystem.isEnabled('gamification')) {
        _displayGamificationStats();
    }
}

// ==============================================
// 📋 TASK QUEUE REGISTRATION
// ==============================================
TaskQueue.registerTask(
    'emergencyCleanup',
    100,
    () => adaptiveSystem.emergencyCleanup(),
    () => adaptiveSystem.evaluate() === adaptiveSystem.MODE.EMERGENCY
);

TaskQueue.registerTask(
    'loggerInit',
    1,
    () => logger.init(),
    () => adaptiveSystem.isEnabled('logging')
);

TaskQueue.registerTask(
    'gamificationInit',
    1,
    () => {
        gamification.init();
        gamification.updateStreak();
    },
    () => adaptiveSystem.isEnabled('gamification')
);

TaskQueue.registerTask(
    'memVisSnapshot',
    20,
    () => memVis.recordSnapshot(),
    () => adaptiveSystem.isEnabled('memoryVisualizer')
);
