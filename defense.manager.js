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
        // ⚡ PERFORMANCE: Use centralized room caches pre-warmed in main.js. (main.jsで準備された部屋ごとのキャッシュを使用)
        const towers = room._towers || [];

        if (towers.length === 0) {
            return;
        }

        // 脅威の優先順位付け
        const hostiles = room._hostileCreeps || [];
        const damagedCreeps = room._injuredCreeps || [];

        // ⚡ PERFORMANCE: Use pre-filtered room-level repair targets.
        const damagedStructures = room._repairTargets || [];

        // ⚡ PERFORMANCE: Hoist critical target lookups outside the tower loop
        // ループの外で一度だけ計算することで、各タワーごとの冗長な走査と条件チェックを回避。
        if (room._criticalCreepTick !== Game.time) {
            room._criticalCreep = damagedCreeps.find((c) => c.hits < c.hitsMax * 0.5);
            room._criticalCreepTick = Game.time;
        }
        const criticalCreep = room._criticalCreep;

        if (room._criticalStructureTick !== Game.time) {
            room._criticalStructure = damagedStructures.find(
                (s) => s.hits < s.hitsMax * 0.3 && s.structureType !== STRUCTURE_RAMPART
            );
            room._criticalStructureTick = Game.time;
        }
        const criticalStructure = room._criticalStructure;

        for (let i = 0; i < towers.length; i++) {
            const tower = towers[i];
            // 優先度1: 敵creepへの攻撃
            if (hostiles.length > 0) {
                const target = tower.pos.findClosestByRange(hostiles);
                if (target) {
                    tower.attack(target);
                    continue;
                }
            }

            // 優先度2: 味方creepの回復
            if (criticalCreep) {
                tower.heal(criticalCreep);
                continue;
            }

            // 優先度3: 構造物の修理（エネルギーが十分な時のみ）
            if (tower.store[RESOURCE_ENERGY] > 500 && criticalStructure) {
                tower.repair(criticalStructure);
            }
        }
    },

    // 脅威レベル評価
    checkThreats: function (room) {
        // ⚡ PERFORMANCE: Use centralized room cache for hostile creeps pre-warmed in main.js. (main.jsで準備された敵クリープのキャッシュを使用)
        const hostiles = room._hostileCreeps || [];

        if (hostiles.length === 0) {
            room._threatLevel = 0;
            return 0;
        }

        // 脅威レベル計算
        let threatLevel = 0;
        for (let i = 0; i < hostiles.length; i++) {
            const hostile = hostiles[i];
            const body = hostile.body;
            // ⚡ PERFORMANCE: Use a simple loop instead of filter().length to avoid memory allocation
            for (let j = 0; j < body.length; j++) {
                const part = body[j];
                const type = part.type;
                if (type === ATTACK || type === RANGED_ATTACK || type === HEAL) {
                    threatLevel++;
                }
            }
        }

        // ⚡ PERFORMANCE: Use volatile room caching to avoid Memory serialization overhead
        // ティックごとの計算値はMemoryではなくRoomオブジェクトに保持することで高速化。
        room._threatLevel = threatLevel;

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
        const threatLevel = room._threatLevel || 0;

        // ⚡ PERFORMANCE: Use pre-warmed defenders and spawns caches from main.js. (main.jsで準備された防衛隊とスポーンのキャッシュを使用)
        const defenders = room._defenders || [];

        // 脅威に応じて必要な防衛creep数を決定
        const requiredDefenders = Math.min(Math.ceil(threatLevel / 3), 4);

        if (defenders.length < requiredDefenders && threatLevel > 0) {
            // スポーン準備
            const spawns = room._freeSpawns || [];

            if (spawns.length > 0) {
                this.spawnDefender(spawns[0], threatLevel);
            }
        }

        // 既存のdefenderに指示
        for (let i = 0; i < defenders.length; i++) {
            this.runDefender(defenders[i]);
        }
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
        // ⚡ PERFORMANCE: Use centralized room cache for hostile creeps pre-warmed in main.js. (main.jsで準備された敵のキャッシュを使用)
        const hostiles = creep.room._hostileCreeps || [];
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
        // ⚡ PERFORMANCE: Use centralized room caches pre-warmed in main.js. (集約されたキャッシュを使用して統計を表示)
        const towers = (room._towers || []).length;
        const defenders = (room._defenders || []).length;

        const threatLevel = room._threatLevel || 0;

        console.log(`🛡️ Defense Status [${room.name}]:`);
        console.log(`   Towers: ${towers} | Defenders: ${defenders} | Threat: ${threatLevel}`);
    },
};

module.exports = defenseManager;
