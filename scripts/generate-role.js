const crypto = require('crypto');
const fs = require('fs');

// 作成可能なロールのテンプレート
const roleTemplates = [
    {
        name: 'defender',
        description: '部屋を防衛する戦闘クリープ',
        body: `const roleDefender = {
    run: function(creep) {
        // 敵を探す
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            // 最も近い敵を攻撃
            const target = creep.pos.findClosestByRange(hostiles);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        } else {
            // 敵がいない場合は部屋の中心付近で待機
            const flag = Game.flags['DefensePoint'];
            if (flag) {
                creep.moveTo(flag);
            } else {
                creep.moveTo(25, 25);
            }
        }
    }
};

module.exports = roleDefender;`,
    },
    {
        name: 'miner',
        description: 'ソースの隣に固定して採掘する効率的なハーベスター',
        body: `const roleMiner = {
    run: function(creep) {
        // 担当ソースが未設定なら割り当て
        if (!creep.memory.sourceId) {
            const sources = creep.room.find(FIND_SOURCES);
            creep.memory.sourceId = sources[0].id;
        }

        const source = Game.getObjectById(creep.memory.sourceId);
        if (!source) return;

        // ソースの隣に移動
        if (!creep.pos.isNearTo(source)) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            // 採掘
            creep.harvest(source);

            // 隣にコンテナがあればエネルギーを転送
            const container = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
            })[0];

            if (container && creep.store.getFreeCapacity() === 0) {
                creep.transfer(container, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleMiner;`,
    },
    {
        name: 'claimer',
        description: '新しい部屋をクレームして領土を拡大',
        body: `const roleClaimer = {
    run: function(creep) {
        // ターゲットルームが未設定なら終了
        if (!creep.memory.targetRoom) {
            console.log('Claimer needs targetRoom in memory!');
            return;
        }

        // ターゲットルームに移動
        if (creep.room.name !== creep.memory.targetRoom) {
            const exit = creep.room.findExitTo(creep.memory.targetRoom);
            const exitPos = creep.pos.findClosestByRange(exit);
            creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#00ff00'}});
        } else {
            // コントローラーをクレーム
            const controller = creep.room.controller;
            if (controller) {
                if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
    }
};

module.exports = roleClaimer;`,
    },
    {
        name: 'remoteHarvester',
        description: '隣の部屋からエネルギーを持ち帰る',
        body: `const roleRemoteHarvester = {
    run: function(creep) {
        // ターゲットルームが未設定なら終了
        if (!creep.memory.targetRoom) {
            console.log('RemoteHarvester needs targetRoom in memory!');
            return;
        }

        if (creep.store.getFreeCapacity() > 0) {
            // ターゲットルームへ移動して採掘
            if (creep.room.name !== creep.memory.targetRoom) {
                const exit = creep.room.findExitTo(creep.memory.targetRoom);
                const exitPos = creep.pos.findClosestByRange(exit);
                creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#ffff00'}});
            } else {
                const source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
        } else {
            // ホームルームに戻ってスポーンに転送
            if (creep.room.name !== creep.memory.homeRoom) {
                const exit = creep.room.findExitTo(creep.memory.homeRoom);
                const exitPos = creep.pos.findClosestByRange(exit);
                creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleRemoteHarvester;`,
    },
    {
        name: 'healer',
        description: '傷ついたクリープを回復する',
        body: `const roleHealer = {
    run: function(creep) {
        // 傷ついた味方クリープを探す
        const damagedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });

        if (damagedCreep) {
            // 回復
            if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep, {visualizePathStyle: {stroke: '#00ff00'}});
                // 移動中も遠隔回復
                creep.rangedHeal(damagedCreep);
            }
        } else {
            // 傷ついたクリープがいない場合は防衛ポイントへ
            const flag = Game.flags['HealPoint'];
            if (flag) {
                creep.moveTo(flag);
            } else {
                // 戦闘クリープの近くに待機
                const defender = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: c => c.memory.role === 'defender'
                });
                if (defender) {
                    creep.moveTo(defender);
                }
            }
        }
    }
};

module.exports = roleHealer;`,
    },
    {
        name: 'scout',
        description: '周辺の部屋を探索してマップする（改良版）',
        body: `const roleScout = {
    run: function(creep) {
        // 探索済み部屋リストを初期化
        if (!Memory.scoutedRooms) {
            Memory.scoutedRooms = {};
        }

        // 現在の部屋を記録
        const room = creep.room;
        if (!Memory.scoutedRooms[room.name]) {
            Memory.scoutedRooms[room.name] = {
                timestamp: Game.time,
                sources: room.find(FIND_SOURCES).length,
                controller: room.controller ? {
                    level: room.controller.level,
                    owner: room.controller.owner ? room.controller.owner.username : null,
                    reservation: room.controller.reservation ? room.controller.reservation.username : null
                } : null,
                hostiles: room.find(FIND_HOSTILE_CREEPS).length
            };
            console.log(\`📍 Scout mapped: \${room.name}\`);
        }

        // 次の探索先を決定
        if (!creep.memory.targetRoom) {
            const exits = Game.map.describeExits(room.name);
            const unscoutedExits = Object.entries(exits).filter(
                ([dir, roomName]) => !Memory.scoutedRooms[roomName]
            );

            if (unscoutedExits.length > 0) {
                const [dir, targetRoom] = unscoutedExits[0];
                creep.memory.targetRoom = targetRoom;
            } else {
                // 全部屋探索済みなら最も古い記録の部屋へ
                const oldestRoom = Object.entries(Memory.scoutedRooms)
                    .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
                if (oldestRoom) {
                    creep.memory.targetRoom = oldestRoom[0];
                }
            }
        }

        // ターゲット部屋へ移動
        if (creep.memory.targetRoom && room.name !== creep.memory.targetRoom) {
            const exit = room.findExitTo(creep.memory.targetRoom);
            const exitPos = room.findClosestByRange(exit);
            if (exitPos) {
                creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#00ffff'}});
            }
        } else {
            // 到着したらターゲットをクリア
            delete creep.memory.targetRoom;
        }
    }
};

module.exports = roleScout;`,
    },
    {
        name: 'powerHarvester',
        description: 'Power Bankを攻撃してパワーを回収',
        body: `const rolePowerHarvester = {
    run: function(creep) {
        // Power Bankのある部屋が未設定なら探す
        if (!creep.memory.powerBankRoom) {
            // メモリに記録されたPower Bank情報をチェック
            if (Memory.powerBanks && Memory.powerBanks.length > 0) {
                const nearest = Memory.powerBanks[0];
                creep.memory.powerBankRoom = nearest.room;
                creep.memory.powerBankId = nearest.id;
            } else {
                console.log('No Power Banks found in memory');
                return;
            }
        }

        // ターゲット部屋に移動
        if (creep.room.name !== creep.memory.powerBankRoom) {
            const exit = creep.room.findExitTo(creep.memory.powerBankRoom);
            const exitPos = creep.pos.findClosestByRange(exit);
            creep.moveTo(exitPos, {visualizePathStyle: {stroke: '#ff00ff'}});
        } else {
            // Power Bankを攻撃
            const powerBank = Game.getObjectById(creep.memory.powerBankId);
            if (powerBank) {
                if (creep.attack(powerBank) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(powerBank, {visualizePathStyle: {stroke: '#ff00ff'}});
                }
            } else {
                // Power Bankが破壊されたらパワーを拾う
                const power = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: r => r.resourceType === RESOURCE_POWER
                });
                if (power) {
                    if (creep.pickup(power) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(power);
                    }
                } else {
                    // タスク完了
                    delete creep.memory.powerBankRoom;
                    delete creep.memory.powerBankId;
                }
            }
        }
    }
};

module.exports = rolePowerHarvester;`,
    },
];

// 既存のロールファイルを確認
const existingRoles = fs
    .readdirSync('.')
    .filter((f) => f.startsWith('role.') && f.endsWith('.js'))
    .map((f) => f.replace('role.', '').replace('.js', ''));

console.log('📋 Existing roles:', existingRoles.join(', '));

// まだ作成されていないロールを探す
const availableTemplates = roleTemplates.filter((t) => !existingRoles.includes(t.name));

if (availableTemplates.length === 0) {
    console.log('✅ All role templates already exist!');
    fs.writeFileSync(
        'last-role-creation.json',
        JSON.stringify(
            {
                role: null,
                description: 'All templates exist',
                timestamp: new Date().toISOString(),
                remaining: 0,
            },
            null,
            2
        )
    );
    process.exit(0);
}

// ランダムに1つ選択
const selected = availableTemplates[crypto.randomInt(availableTemplates.length)];

console.log(`🆕 Creating new role: ${selected.name}`);
console.log(`📝 Description: ${selected.description}`);

// ファイル作成
const filename = `role.${selected.name}.js`;
fs.writeFileSync(filename, selected.body);

// レポート作成
const report = {
    role: selected.name,
    description: selected.description,
    filename: filename,
    timestamp: new Date().toISOString(),
    remaining: availableTemplates.length - 1,
};
fs.writeFileSync('last-role-creation.json', JSON.stringify(report, null, 2));

console.log(`✅ Created: ${filename}`);
console.log(`📊 Remaining templates: ${report.remaining}`);
