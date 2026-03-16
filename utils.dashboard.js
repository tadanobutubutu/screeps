const adaptiveSystem = require('system.adaptive');

/**
 * Formats a number for better readability (e.g., 1000 -> 1.0K, 1000000 -> 1.0M)
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

const DashboardRenderer = {
    renderRoomDashboard(room) {
        const creeps = room.find(FIND_MY_CREEPS);
        const structures = room.find(FIND_MY_STRUCTURES);
        const hostiles = room.find(FIND_HOSTILE_CREEPS);

        // ⚡ PERFORMANCE OPTIMIZATION: Use a single loop to count roles instead of multiple filters.
        // This reduces complexity from O(4N) to O(N) and avoids multiple array allocations.
        const roleCount = { harvester: 0, upgrader: 0, builder: 0, repairer: 0 };
        for (let i = 0; i < creeps.length; i++) {
            const role = creeps[i].memory.role;
            if (role === 'harvester') roleCount.harvester++;
            else if (role === 'upgrader') roleCount.upgrader++;
            else if (role === 'builder') roleCount.builder++;
            else if (role === 'repairer') roleCount.repairer++;
        }

        const energyStats = {
            available: room.energyAvailable,
            capacity: room.energyCapacityAvailable,
            storageEnergy: room.storage ? room.storage.store[RESOURCE_ENERGY] : 0,
        };

        const info = {
            room: room.name,
            controller: room.controller
                ? {
                      level: room.controller.level,
                      progress: room.controller.progress || 0,
                      progressTotal: room.controller.progressTotal || 0,
                      percent: room.controller.progressTotal
                          ? Math.floor(
                                (room.controller.progress / room.controller.progressTotal) * 100
                            )
                          : 100,
                  }
                : null,
            hostiles: hostiles.length,
            structures: structures.length,
            energy: `${formatNumber(energyStats.available)}/${formatNumber(energyStats.capacity)}`,
            energyAvailable: energyStats.available,
            energyCapacity: energyStats.capacity,
            storage: formatNumber(energyStats.storageEnergy),
            creeps: roleCount,
            mode: adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase(),
            bucket: Game.cpu.bucket,
        };

        return info;
    },

    displayVisuals(room) {
        const info = this.renderRoomDashboard(room);

        let y = 2.5;
        const x = 1;
        const width = 8;
        const height = 9.0;

        // 🎨 Accessibility: Semi-transparent background for readability
        room.visual.rect(x - 0.5, y - 1, width, height, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });

        // 🏠 Room Name & Mode
        room.visual.text(`🏠 ${info.room} [${info.mode}]`, x, y, {
            font: 0.8,
            color: '#00ff00',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y++;

        // 🎮 Controller info
        const controllerText = info.controller
            ? `🎮 RCL: ${info.controller.level} (${info.controller.percent}%)`
            : '🎮 RCL: None';
        room.visual.text(controllerText, x, y, {
            font: 0.7,
            color: '#ffff00',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // RCL Progress Bar
        if (info.controller) {
            const barWidth = 6;
            const barHeight = 0.2;
            const progress = info.controller.progress / info.controller.progressTotal;

            room.visual.rect(x, y - 0.1, barWidth, barHeight, {
                fill: '#333333',
                stroke: '#ffffff',
                strokeWidth: 0.02,
            });
            room.visual.rect(x, y - 0.1, barWidth * progress, barHeight, {
                fill: '#ffff00',
                opacity: 0.8,
            });
        }
        y += 0.8;

        // ⚡ Energy info
        room.visual.text(`⚡ Energy: ${info.energy}`, x, y, {
            font: 0.7,
            color: '#00ffff',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // Energy Progress Bar
        const energyBarWidth = 6;
        const energyBarHeight = 0.2;
        const energyProgress = Math.min(info.energyAvailable / info.energyCapacity, 1);
        room.visual.rect(x, y - 0.1, energyBarWidth, energyBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, energyBarWidth * energyProgress, energyBarHeight, {
            fill: '#00ffff',
            opacity: 0.8,
        });
        y += 0.6;

        // 📦 Storage info
        room.visual.text(`📦 Storage: ${info.storage}`, x, y, {
            font: 0.7,
            color: '#ffffff',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y++;

        // 👥 Creeps info
        room.visual.text(
            `👥 ⛏️:${info.creeps.harvester} ⬆️:${info.creeps.upgrader} 🛠️:${info.creeps.builder} 🔧:${info.creeps.repairer}`,
            x,
            y,
            {
                font: 0.7,
                color: '#ff00ff',
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );

        if (info.hostiles > 0) {
            y++;
            room.visual.text(`⚠️ HOSTILES: ${info.hostiles}`, x, y, {
                font: 0.8,
                color: '#ff0000',
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.1,
            });
        }

        // 🔋 CPU Bucket
        y += 0.8;
        const bucketProgress = Math.min(info.bucket / 10000, 1);
        room.visual.rect(x, y, 6, 0.2, { fill: '#333333', stroke: '#ffffff', strokeWidth: 0.02 });

        let bucketColor = '#ff0000';
        if (info.bucket > 7000) {
            bucketColor = '#00ff00';
        } else if (info.bucket > 3000) {
            bucketColor = '#ffff00';
        }

        room.visual.rect(x, y, 6 * bucketProgress, 0.2, {
            fill: bucketColor,
            opacity: 0.7,
        });
        room.visual.text(`CPU: ${info.bucket}`, x + 6.2, y + 0.15, {
            font: 0.4,
            color: '#ffffff',
            align: 'left',
        });
    },
};

module.exports = DashboardRenderer;
