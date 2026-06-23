import sys

def refactor():
    with open('main.js', 'r') as f:
        content = f.read()

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

    new_helpers = """function _collectCreepData(creep, creepCounts, isLoggingEnabled) {
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

function processCreeps(rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
    const creepCounts = Object.create(null);

    for (let i = 0; i < rooms.length; i++) {
        warmRoomCache(rooms[i]);
    }

    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (site.my && site.room) {
            site.room._myConstructionSites.push(site);
        }
    }

    for (let i = 0; i < creeps.length; i++) {
        _collectCreepData(creeps[i], creepCounts, isLoggingEnabled);
    }

    const processFn = isLoggingEnabled ? runCreepWithLogging : runCreepMinimal;
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        processFn(creep, creep._role, creep.name, isEmotionsEnabled);
    }

    return creepCounts;
}"""

    content = content.replace(old_process_creeps, new_helpers)

    with open('main.js', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    refactor()
