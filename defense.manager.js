// 🛡️ Advanced Defense Manager
// 自動防衛システム - タワー制御と緊急防衛creep生成

const defenseManager = {
    // メイン防衛ループ
    run: function (room) {
        this.manageTowers(room);
        this.checkThreats(room);
        this.manageDefenders(room);
    },

    // タワー自動制御
    manageTowers: function (room) {
        // ⚡ PERFORMANCE: Reuse cached room structures and creeps if available (populated by dashboard)
        const myStructures = room._myStructures || room.find(FIND_MY_STRUCTURES);
        const towers = myStructures.filter((s) => s.structureType === STRUCTURE_TOWER);

        if (towers.length === 0) {
            return;
        }

        // 脅威の優先順位付け
        const hostiles = room._hostileCreeps || room.find(FIND_HOSTILE_CREEPS);
        const myCreeps = room._myCreeps || room.find(FIND_MY_CREEPS);

        const damagedCreeps = myCreeps.filter((c) => c.hits < c.hitsMax);

        // FIND_STRUCTURES (including non-my) is not cached yet, but we can filter from myStructures if it's mostly our structures
        const damagedStructures = room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL,
        });

        towers.forEach((tower) => {
            // 優先度1: 敵creepへの攻撃
            if (hostiles.length > 0) {
                const target = tower.pos.findClosestByRange(hostiles);
                if (target) {
                    tower.attack(target);
                    return;
                }
            }

            // 優先度2: 味方creepの回復
            if (damagedCreeps.length > 0) {
                const critical = damagedCreeps.find((c) => c.hits < c.hitsMax * 0.5);
                if (critical) {
                    tower.heal(critical);
                    return;
                }
            }

            // 優先度3: 構造物の修理（エネルギーが十分な時のみ）
            if (tower.store[RESOURCE_ENERGY] > 500) {
                const criticalStructure = damagedStructures.find(
                    (s) => s.hits < s.hitsMax * 0.3 && s.structureType !== STRUCTURE_RAMPART
                );
                if (criticalStructure) {
                    tower.repair(criticalStructure);
                }
            }
        });
    },

    // 脅威レベル評価
    checkThreats: function (room) {
        // ⚡ PERFORMANCE: Reuse cached hostile creeps
        const hostiles = room._hostileCreeps || room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length === 0) {
            if (Memory.defenseLevel) {
                delete Memory.defenseLevel;
            }
            return 0;
        }

        // 脅威レベル計算
        let threatLevel = 0;
        hostiles.forEach((hostile) => {
            const parts = hostile.body;
            const attackParts = parts.filter(
                (p) => p.type === ATTACK || p.type === RANGED_ATTACK || p.type === HEAL
            ).length;
            threatLevel += attackParts;
        });

        Memory.defenseLevel = threatLevel;

        // 警告表示
        if (threatLevel > 5) {
            console.log(`🚨 HIGH THREAT in ${room.name}: Level ${threatLevel}`);
        } else if (threatLevel > 0) {
            console.log(`⚠️ Threat detected in ${room.name}: Level ${threatLevel}`);
        }

        return threatLevel;
    },

    // 防衛creep管理
    manageDefenders: function (room) {
        const threatLevel = Memory.defenseLevel || 0;

        // ⚡ PERFORMANCE: Use cached room creeps to find defenders instead of global filter
        const myCreeps = room._myCreeps || room.find(FIND_MY_CREEPS);
        const defenders = myCreeps.filter((c) => c.memory.role === 'defender');

        // 脅威に応じて必要な防衛creep数を決定
        const requiredDefenders = Math.min(Math.ceil(threatLevel / 3), 4);

        if (defenders.length < requiredDefenders && threatLevel > 0) {
            // スポーン準備
            // ⚡ PERFORMANCE: Use cached room structures to find spawns
            const myStructures = room._myStructures || room.find(FIND_MY_STRUCTURES);
            const spawns = myStructures.filter(
                (s) => s.structureType === STRUCTURE_SPAWN && !s.spawning
            );

            if (spawns.length > 0) {
                this.spawnDefender(spawns[0], threatLevel);
            }
        }

        // 既存のdefenderに指示
        defenders.forEach((defender) => this.runDefender(defender));
    },

    // Defender creepの生成
    spawnDefender: function (spawn, threatLevel) {
        const room = spawn.room;
        const energy = room.energyAvailable;

        let body = [];

        // エネルギーと脅威レベルに応じたbody構成
        if (energy >= 1300 && threatLevel > 10) {
            // 強力な脅威用
            body = [
                TOUGH,
                TOUGH,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                MOVE,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                ATTACK,
                RANGED_ATTACK,
                RANGED_ATTACK,
                HEAL,
            ];
        } else if (energy >= 800) {
            // 中程度の脅威用
            body = [TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, HEAL];
        } else if (energy >= 400) {
            // 最小構成
            body = [MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK];
        } else {
            return ERR_NOT_ENOUGH_ENERGY;
        }

        const name = `Defender_${Game.time}`;
        const result = spawn.spawnCreep(body, name, {
            memory: { role: 'defender', mode: 'patrol' },
        });

        if (result === OK) {
            console.log(`🛡️ Spawning defender: ${name}`);
        }

        return result;
    },

    // Defender creepの行動制御
    runDefender: function (creep) {
        // ⚡ PERFORMANCE: Use cached hostile creeps
        const hostiles = creep.room._hostileCreeps || creep.room.find(FIND_HOSTILE_CREEPS);
        const hostile = creep.pos.findClosestByRange(hostiles);

        if (hostile) {
            // 敵を発見
            if (creep.pos.getRangeTo(hostile) > 1) {
                creep.moveTo(hostile, {
                    visualizePathStyle: { stroke: '#ff0000' },
                });
            }

            // 攻撃
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.rangedAttack(hostile);
            }

            // 自己回復
            if (creep.hits < creep.hitsMax * 0.6) {
                creep.heal(creep);
            }
        } else {
            // パトロールモード
            if (!creep.memory.patrolTarget) {
                const flag = Game.flags['Patrol'];
                if (flag) {
                    creep.memory.patrolTarget = flag.pos;
                } else {
                    // 部屋の中央をパトロール
                    creep.memory.patrolTarget = new RoomPosition(25, 25, creep.room.name);
                }
            }

            if (creep.pos.getRangeTo(creep.memory.patrolTarget) > 3) {
                creep.moveTo(creep.memory.patrolTarget, {
                    visualizePathStyle: { stroke: '#00ff00' },
                });
            }
        }
    },

    // 統計情報表示
    showStats: function (room) {
        // ⚡ PERFORMANCE: Use cached room objects
        const myStructures = room._myStructures || room.find(FIND_MY_STRUCTURES);
        const towers = myStructures.filter((s) => s.structureType === STRUCTURE_TOWER).length;

        const myCreeps = room._myCreeps || room.find(FIND_MY_CREEPS);
        const defenders = myCreeps.filter((c) => c.memory.role === 'defender').length;

        const threatLevel = Memory.defenseLevel || 0;

        console.log(`🛡️ Defense Status [${room.name}]:`);
        console.log(`   Towers: ${towers} | Defenders: ${defenders} | Threat: ${threatLevel}`);
    },
};

module.exports = defenseManager;
