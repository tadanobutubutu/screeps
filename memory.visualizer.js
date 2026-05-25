/**
 * Memory Visualizer - メモリを視覚化する楽しいシステム
 */

const utilsMemory = require('./utils.memory');
const cache = require('./src/utils/cache');

/**
 * セキュリティ: メモリDoSを防ぐためのメモリ消費構造の制限。
 * Screepsのメモリは2MBに制限されており、制限のないオブジェクトはAIをクラッシュさせる可能性があります。
 */
const MAX_EXPLORED_ROOMS = 100;
const MAX_ROOM_DATA = 50;
const MAX_DIARY_MESSAGE_LENGTH = 200;
const MAX_LEADERBOARD_ENTRIES = 50;
const MAX_LEADERBOARD_TYPES = 10;

const memoryVisualizer = {
    /**
     * メモリ全体の統計を表示
     */
    showStats: function () {
        const stats = {
            totalSize: JSON.stringify(Memory).length,
            creeps: Object.keys(Memory.creeps || {}).length,
            rooms: Object.keys(Memory.rooms || {}).length,
            flags: Object.keys(Memory.flags || {}).length,
            spawns: Object.keys(Memory.spawns || {}).length,
        };

        console.log('📊 Memory Stats:');
        console.log(`  Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
        console.log(`  Creeps: ${stats.creeps}`);
        console.log(`  Rooms: ${stats.rooms}`);
        console.log(`  Flags: ${stats.flags}`);
        console.log(`  Spawns: ${stats.spawns}`);

        return stats;
    },

    /**
     * メモリの大きい順にソート表示
     */
    showTopMemoryUsers: function (limit = 10) {
        const sizes = [];

        for (const name in Memory.creeps) {
            if (
                utilsMemory.isSafeKey(name) &&
                Object.prototype.hasOwnProperty.call(Memory.creeps, name)
            ) {
                sizes.push({
                    type: 'creep',
                    name: name,
                    size: JSON.stringify(Memory.creeps[name]).length,
                });
            }
        }

        for (const name in Memory.rooms) {
            if (
                utilsMemory.isSafeKey(name) &&
                Object.prototype.hasOwnProperty.call(Memory.rooms, name)
            ) {
                sizes.push({
                    type: 'room',
                    name: name,
                    size: JSON.stringify(Memory.rooms[name]).length,
                });
            }
        }

        sizes.sort((a, b) => b.size - a.size);

        console.log(`📈 Top ${limit} Memory Users:`);
        sizes.slice(0, limit).forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.type}] ${item.name}: ${item.size} bytes`);
        });

        return sizes;
    },

    /**
     * メモリタイムマシン
     */
    initTimeMachine: function () {
        if (!Memory.timeMachine) {
            Memory.timeMachine = {
                snapshots: [],
                maxSnapshots: 100,
                enabled: true,
            };
        }
    },

    recordSnapshot: function () {
        this.initTimeMachine();

        if (!Memory.timeMachine.enabled) {
            return;
        }

        const snapshot = {
            time: Game.time,
            gcl: Game.gcl.level,
            cpu: Game.cpu.getUsed(),
            bucket: Game.cpu.bucket,
            creeps: Object.keys(Game.creeps).length,
            energy: Object.values(Game.rooms).reduce((sum, room) => {
                return sum + (room.energyAvailable || 0);
            }, 0),
        };

        Memory.timeMachine.snapshots.push(snapshot);

        if (Memory.timeMachine.snapshots.length > Memory.timeMachine.maxSnapshots) {
            Memory.timeMachine.snapshots.shift();
        }
    },

    showHistory: function (ticks = 10) {
        this.initTimeMachine();

        const snapshots = Memory.timeMachine.snapshots.slice(-ticks);

        console.log(`⏰ History (Last ${ticks} snapshots):`);
        snapshots.forEach((snap) => {
            console.log(
                `  Tick ${snap.time}: Creeps=${snap.creeps}, CPU=${snap.cpu.toFixed(2)}, Energy=${snap.energy}`
            );
        });

        return snapshots;
    },

    /**
     * メモリリーダーボード
     */
    initLeaderboard: function () {
        if (!Memory.leaderboard) {
            Memory.leaderboard = {
                harvested: {},
                built: {},
                upgraded: {},
                repaired: {},
                distance: {},
            };
        }
    },

    recordAchievement: function (creepName, type, amount) {
        this.initLeaderboard();

        // セキュリティ: プロトタイプ汚染とデータ破損を防ぐための入力バリデーション
        if (!utilsMemory.isSafeKey(creepName) || !utilsMemory.isSafeKey(type)) {
            return;
        }

        // セキュリティ: メモリ破損/NaNを防ぐため、amountが有効な数値であることを確認
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount)) {
            return;
        }

        if (!Memory.leaderboard[type]) {
            // セキュリティ: メモリDoSを防ぐため、リーダーボードのタイプ数を制限
            if (Object.keys(Memory.leaderboard).length >= MAX_LEADERBOARD_TYPES) {
                return;
            }
            Memory.leaderboard[type] = {};
        }

        const board = Memory.leaderboard[type];

        // セキュリティ: メモリDoSを防ぐため、リーダーボードあたりのエントリ数を制限
        if (!board[creepName] && Object.keys(board).length >= MAX_LEADERBOARD_ENTRIES) {
            // 追い出しポリシー: 最も低いスコアのエントリを削除
            const lowestEntry = Object.entries(board).sort((a, b) => a[1] - b[1])[0];
            if (lowestEntry && numericAmount > lowestEntry[1]) {
                delete board[lowestEntry[0]];
            } else if (!lowestEntry || numericAmount <= (lowestEntry[1] || 0)) {
                // If the new score is not better than the lowest, don't add it
                return;
            }
        }

        if (!board[creepName]) {
            board[creepName] = 0;
        }

        board[creepName] += numericAmount;
    },

    showLeaderboard: function (type = 'harvested', limit = 10) {
        this.initLeaderboard();

        const board = Memory.leaderboard[type] || {};
        const sorted = Object.entries(board)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);

        console.log(`🏆 Leaderboard - ${type} (Top ${limit}):`);
        sorted.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
            console.log(`  ${medal} ${index + 1}. ${entry[0]}: ${entry[1]}`);
        });

        return sorted;
    },

    /**
     * Creep日記
     */
    initDiary: function (creepName) {
        // Security: Validate creepName to prevent prototype pollution
        if (!utilsMemory.isSafeKey(creepName) || !Memory.creeps[creepName]) {
            return;
        }

        if (!Memory.creeps[creepName]?.diary) {
            Memory.creeps[creepName].diary = {
                entries: [],
                maxEntries: 20,
            };
        }
    },

    addDiaryEntry: function (creepName, message) {
        // Security: Validate creepName to prevent prototype pollution
        if (!utilsMemory.isSafeKey(creepName)) {
            return;
        }

        this.initDiary(creepName);

        if (!Memory.creeps[creepName]?.diary) {
            return;
        }

        // Security: Truncate message to avoid Memory DoS
        const sanitizedMessage = String(message).substring(0, MAX_DIARY_MESSAGE_LENGTH);

        const entry = {
            time: Game.time,
            message: sanitizedMessage,
        };

        Memory.creeps[creepName].diary.entries.push(entry);

        const diary = Memory.creeps[creepName].diary;
        if (diary.entries.length > diary.maxEntries) {
            diary.entries.shift();
        }
    },

    readDiary: function (creepName) {
        // Security: Validate creepName to prevent prototype pollution
        if (!utilsMemory.isSafeKey(creepName) || !Memory.creeps[creepName]?.diary) {
            console.log(`📝 No diary for ${creepName}`);
            return [];
        }

        const diary = Memory.creeps[creepName].diary;
        console.log(`📝 Diary of ${creepName}:`);
        diary.entries.forEach((entry) => {
            console.log(`  [Tick ${entry.time}] ${entry.message}`);
        });

        return diary.entries;
    },

    /**
     * メモリマップ
     */
    initMemoryMap: function () {
        if (!Memory.map) {
            Memory.map = {
                rooms: {},
                explored: [],
            };
        }
    },

    recordRoom: function (roomName) {
        // Security: Validate roomName to prevent prototype pollution
        if (!utilsMemory.isSafeKey(roomName)) {
            return;
        }

        this.initMemoryMap();

        const room = Game.rooms[roomName];
        if (!room) {
            return;
        }

        // Security: Cap the number of rooms stored in Memory to prevent DoS
        const roomKeys = Object.keys(Memory.map.rooms);
        if (roomKeys.length >= MAX_ROOM_DATA && !Memory.map.rooms[roomName]) {
            const oldestRoom = roomKeys.sort((a, b) => {
                return Memory.map.rooms[a].lastVisit - Memory.map.rooms[b].lastVisit;
            })[0];
            delete Memory.map.rooms[oldestRoom];
        }

        Memory.map.rooms[roomName] = {
            lastVisit: Game.time,
            controller: room.controller
                ? {
                      owner: room.controller.owner?.username ?? null,
                      level: room.controller.level,
                  }
                : null,
            sources: cache.getSources(room).length,
            minerals: room.find(FIND_MINERALS).length,
            hostiles: cache.getEnemies(room).length,
        };

        if (!Memory.map.explored.includes(roomName)) {
            Memory.map.explored.push(roomName);

            // Security: Limit history of explored rooms
            if (Memory.map.explored.length > MAX_EXPLORED_ROOMS) {
                Memory.map.explored.shift();
            }
        }
    },

    showMap: function () {
        this.initMemoryMap();

        console.log('🗺️ Memory Map:');
        console.log(`  Explored Rooms: ${Memory.map.explored.length}`);

        for (const roomName in Memory.map.rooms) {
            if (
                utilsMemory.isSafeKey(roomName) &&
                Object.prototype.hasOwnProperty.call(Memory.map.rooms, roomName)
            ) {
                const info = Memory.map.rooms[roomName];
                const owner = info.controller?.owner ?? 'Unclaimed';
                console.log(
                    `  ${roomName}: Owner=${owner}, Sources=${info.sources}, Hostiles=${info.hostiles}`
                );
            }
        }
    },

    /**
     * メモリクリーナー
     */
    cleanup: function () {
        let cleaned = 0;

        cleaned += utilsMemory.cleanMemory();

        if (Memory.flags) {
            for (const name in Memory.flags) {
                if (
                    utilsMemory.isSafeKey(name) &&
                    Object.prototype.hasOwnProperty.call(Memory.flags, name) &&
                    !Game.flags[name]
                ) {
                    delete Memory.flags[name];
                    cleaned++;
                }
            }
        }

        if (Memory.map?.rooms) {
            for (const roomName in Memory.map.rooms) {
                if (
                    utilsMemory.isSafeKey(roomName) &&
                    Object.prototype.hasOwnProperty.call(Memory.map.rooms, roomName)
                ) {
                    const lastVisit = Memory.map.rooms[roomName].lastVisit;
                    if (Game.time - lastVisit > 1000) {
                        delete Memory.map.rooms[roomName];
                        cleaned++;
                    }
                }
            }
        }

        console.log(`🧹 Cleaned ${cleaned} memory entries`);
        return cleaned;
    },

    /**
     * メモリバックアップ
     */
    backup: function () {
        if (!Memory.backups) {
            Memory.backups = [];
        }

        const memoryClone = { ...Memory };
        delete memoryClone.backups;

        const backup = {
            time: Game.time,
            data: JSON.parse(JSON.stringify(memoryClone)),
        };

        Memory.backups.push(backup);

        if (Memory.backups.length > 5) {
            Memory.backups.shift();
        }

        console.log(`💾 Backup created at tick ${Game.time}`);
    },

    restore: function (index = 0) {
        if (!Memory.backups || Memory.backups.length === 0) {
            console.log('❌ No backups found');
            return false;
        }

        const backup = Memory.backups[index];
        if (!backup) {
            console.log(`❌ Backup ${index} not found`);
            return false;
        }

        const backups = Memory.backups;

        for (const key in Memory) {
            delete Memory[key];
        }

        for (const key in backup.data) {
            if (utilsMemory.isSafeKey(key)) {
                Memory[key] = backup.data[key];
            }
        }
        Memory.backups = backups;

        console.log(`✅ Restored backup from tick ${backup.time}`);
        return true;
    },
};

module.exports = memoryVisualizer;
