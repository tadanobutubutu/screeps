const fs = require('fs');
const crypto = require('crypto');

// 実験カタログ
const experiments = [
    {
        name: 'add-performance-monitor',
        description: 'パフォーマンスモニタリングを追加',
        apply: () => {
            const main = fs.readFileSync('main.js', 'utf8');
            if (main.includes('Performance Monitor')) return false;

            const code = `
    // Performance Monitor (Auto-added)
    if (Game.time % 100 === 0) {
        const used = JSON.stringify(Memory).length;
        const limit = 2048 * 1024;
        console.log(\`📊 Memory: \${(used/1024).toFixed(2)}KB / \${(limit/1024).toFixed(2)}KB (\${(used/limit*100).toFixed(1)}%)\`);
        console.log(\`⚡ CPU: \${Game.cpu.getUsed().toFixed(2)} / \${Game.cpu.limit}\`);
    }
`;
            const updated = main.replace(
                /(module\.exports\.loop\s*=\s*function\s*\(\s*\)\s*{)/,
                `$1${code}`
            );
            fs.writeFileSync('main.js', updated);
            return true;
        },
    },
    {
        name: 'optimize-pathfinding-cache',
        description: '経路探索キャッシュを最適化',
        apply: () => {
            const main = fs.readFileSync('main.js', 'utf8');
            if (main.includes('pathCache')) return false;

            const code = `
    // Path Cache Cleanup (Auto-added)
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache)
            .filter(key => Memory.pathCache[key].tick < Game.time - 1000);
        oldPaths.forEach(key => delete Memory.pathCache[key]);
        if (oldPaths.length > 0) {
            console.log(\`🧼 Cleaned \${oldPaths.length} old cached paths\`);
        }
    }
`;
            const updated = main.replace(
                /(module\.exports\.loop\s*=\s*function\s*\(\s*\)\s*{)/,
                `$1${code}`
            );
            fs.writeFileSync('main.js', updated);
            return true;
        },
    },
    {
        name: 'improve-spawn-priority',
        description: 'スポーン優先度ロジックを改善',
        apply: () => {
            const main = fs.readFileSync('main.js', 'utf8');
            if (main.includes('spawnPriority')) return false;

            const code = `
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
`;
            const updated = main.replace(
                /(module\.exports\.loop\s*=\s*function\s*\(\s*\)\s*{)/,
                `$1${code}`
            );
            fs.writeFileSync('main.js', updated);
            return true;
        },
    },
    {
        name: 'add-tower-optimization',
        description: 'タワーのターゲット選択を最適化',
        apply: () => {
            const main = fs.readFileSync('main.js', 'utf8');
            if (main.includes('towerTargeting')) return false;

            const code = `
    // Smart Tower Targeting (Auto-added)
    const towers = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER);
    const hostilesByRoom = {};
    const damagedByRoom = {};
    towers.forEach(tower => {
        const roomName = tower.room.name;
        if (!hostilesByRoom[roomName]) {
            hostilesByRoom[roomName] = tower.room.find(FIND_HOSTILE_CREEPS);
        }
        const hostiles = hostilesByRoom[roomName];
        if (hostiles.length > 0) {
            // Target closest or strongest enemy
            const target = hostiles.sort((a, b) => {
                const distA = tower.pos.getRangeTo(a);
                const distB = tower.pos.getRangeTo(b);
                return distA === distB ? b.hits - a.hits : distA - distB;
            })[0];
            tower.attack(target);
        } else {
            // Repair damaged structures
            if (!damagedByRoom[roomName]) {
                damagedByRoom[roomName] = tower.room.find(FIND_STRUCTURES, {
                    filter: s => s.hits < s.hitsMax * 0.8
                });
            }
            const damaged = damagedByRoom[roomName];
            if (damaged.length > 0) {
                tower.repair(damaged[0]);
            }
        }
    });
`;
            const updated = main.replace(
                /(module\.exports\.loop\s*=\s*function\s*\(\s*\)\s*{)/,
                `$1${code}`
            );
            fs.writeFileSync('main.js', updated);
            return true;
        },
    },
    {
        name: 'add-energy-efficiency',
        description: 'エネルギー効率トラッキング',
        apply: () => {
            const main = fs.readFileSync('main.js', 'utf8');
            if (main.includes('energyEfficiency')) return false;

            const code = `
    // Energy Efficiency Tracking (Auto-added)
    if (Game.time % 1000 === 0) {
        const rooms = Object.values(Game.rooms).filter(r => r.controller && r.controller.my);
        rooms.forEach(room => {
            const stored = room.energyAvailable;
            const capacity = room.energyCapacityAvailable;
            const efficiency = capacity > 0 ? (stored / capacity * 100).toFixed(1) : 0;
            console.log(\`⚡ Room \${room.name}: \${efficiency}% energy efficiency\`);
        });
    }
`;
            const updated = main.replace(
                /(module\.exports\.loop\s*=\s*function\s*\(\s*\)\s*{)/,
                `$1${code}`
            );
            fs.writeFileSync('main.js', updated);
            return true;
        },
    },
];

function runRandomExperiment() {
    // ランダムに1つ選択
    const selected = experiments[crypto.randomInt(0, experiments.length)];
    if (!selected) {
        console.log("⚠️ No experiment selected");
        return false;
    }
    console.log(`🎲 Selected experiment: ${selected.name}`);
    console.log(`📝 Description: ${selected.description}`);

    let success;
    try {
        success = selected.apply();
    } catch (e) {
        console.error("Error applying experiment:", e);
        success = false;
    }

    if (success) {
        const report = {
            experiment: selected.name,
            description: selected.description,
            timestamp: new Date().toISOString(),
            status: 'applied',
        };
        fs.writeFileSync('last-experiment.json', JSON.stringify(report, null, 2));
        console.log('✅ Experiment applied successfully!');
    } else {
        console.log('⚠️ Experiment already exists or not applicable');
        fs.writeFileSync(
            'last-experiment.json',
            JSON.stringify(
                {
                    experiment: selected.name,
                    description: selected.description,
                    timestamp: new Date().toISOString(),
                    status: 'skipped',
                },
                null,
                2
            )
        );
        return false;
    }
    return true;
}

if (require.main === module) {
    if (!runRandomExperiment()) {
        process.exit(0);
    }
}

module.exports = {
    experiments,
    runRandomExperiment
};
