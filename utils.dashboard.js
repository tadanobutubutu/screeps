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
    formatNumber,

    renderRoomDashboard(room) {
        // ⚡ PERFORMANCE OPTIMIZATION: Use centralized room caches pre-warmed in main.js.
        if (room._myCreepsTick !== Game.time) {
            room._myCreeps = room.find(FIND_MY_CREEPS);
            room._myCreepsTick = Game.time;
        }
        if (room._myStructuresTick !== Game.time) {
            room._myStructures = room.find(FIND_MY_STRUCTURES);
            room._myStructuresTick = Game.time;
        }
        if (room._hostileCreepsTick !== Game.time) {
            room._hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            room._hostileCreepsTick = Game.time;
        }

        const creeps = room._myCreeps;
        const structures = room._myStructures;
        const hostiles = room._hostileCreeps;

        // ⚡ PERFORMANCE OPTIMIZATION: Use pre-calculated role counts from the global loop in main.js
        // to avoid redundant O(N) counting per room in the dashboard.
        let roleCount = room._roleCounts;
        if (!roleCount) {
            roleCount = {
                harvester: 0,
                upgrader: 0,
                builder: 0,
                repairer: 0,
                transporter: 0,
                scout: 0,
                medic: 0,
                explorer: 0,
            };
            for (let i = 0; i < creeps.length; i++) {
                const role = creeps[i].memory.role;
                if (roleCount[role] !== undefined) {
                    roleCount[role]++;
                }
            }
        }

        const energyStats = {
            available: room.energyAvailable,
            capacity: room.energyCapacityAvailable,
            storageEnergy: room.storage ? room.storage.store[RESOURCE_ENERGY] : 0,
            storageCapacity: room.storage ? room.storage.store.getCapacity(RESOURCE_ENERGY) : 0,
        };

        const info = {
            room: room.name,
            gcl: {
                level: Game.gcl.level,
                percent: Number(((Game.gcl.progress / Game.gcl.progressTotal) * 100).toFixed(2)),
                progress: Game.gcl.progress,
                progressTotal: Game.gcl.progressTotal,
            },
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
                      safeMode: room.controller.safeMode,
                      safeModeAvailable: room.controller.safeModeAvailable,
                  }
                : null,
            hostiles: hostiles.length,
            structures: structures.length,
            energy: `${formatNumber(energyStats.available)}/${formatNumber(energyStats.capacity)}`,
            energyPercent: energyStats.capacity
                ? Math.floor((energyStats.available / energyStats.capacity) * 100)
                : 0,
            energyAvailable: energyStats.available,
            energyCapacity: energyStats.capacity,
            storage: formatNumber(energyStats.storageEnergy),
            storagePercent: energyStats.storageCapacity
                ? Math.floor((energyStats.storageEnergy / energyStats.storageCapacity) * 100)
                : 0,
            creeps: roleCount,
            mode: adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase(),
            bucket: Game.cpu.bucket,
            cpuUsed: Game.cpu.getUsed().toFixed(2),
            tick: Game.time,
        };

        return info;
    },

    displayVisuals(room) {
        const info = this.renderRoomDashboard(room);

        let y = 2.0;
        const x = 1;
        const width = 8.5;
        const height = 12.2;

        // 🎨 Accessibility: Semi-transparent background for readability
        room.visual.rect(x - 0.5, y - 1, width, height, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });

        // 🏠 Room Name & Mode
        const modeIcons = {
            EMERGENCY: '🚨',
            MINIMAL: '🔋',
            NORMAL: '⚖️',
            FULL: '🚀',
        };
        const modeColors = {
            EMERGENCY: '#ff0000',
            MINIMAL: '#ffaa00',
            NORMAL: '#ffff00',
            FULL: '#00ff00',
        };
        const modeColor = modeColors[info.mode] || '#ffffff';
        const modeIcon = modeIcons[info.mode] || '⚙️';

        room.visual.text(`🏠 ${info.room} ${modeIcon} [${info.mode}]`, x, y, {
            font: 0.8,
            color: modeColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y++;

        // 🌐 GCL info
        room.visual.text(`🌐 GCL: ${info.gcl.level} (${info.gcl.percent.toFixed(2)}%)`, x, y, {
            font: 0.7,
            color: '#00aaff',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // GCL Progress Bar
        const gclBarWidth = 6;
        const gclBarHeight = 0.2;
        const gclProgress = info.gcl.progress / info.gcl.progressTotal;
        room.visual.rect(x, y - 0.1, gclBarWidth, gclBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, gclBarWidth * gclProgress, gclBarHeight, {
            fill: '#00aaff',
            opacity: 0.8,
        });
        y += 0.6;

        // 🎮 Controller info
        let controllerText = info.controller
            ? `🎮 RCL: ${info.controller.level} (${info.controller.percent}%)`
            : '🎮 RCL: None';

        if (info.controller) {
            if (info.controller.safeMode) {
                controllerText += ` 🛡️:${info.controller.safeMode}`;
            } else {
                controllerText += ` 🛡️:x${info.controller.safeModeAvailable || 0}`;
            }
        }

        room.visual.text(controllerText, x, y, {
            font: 0.7,
            color: '#ffff00',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // RCL Progress Bar
        if (info.controller && info.controller.level < 8) {
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
        let energyColor = '#00ffff'; // Cyan (Default/Healthy)
        if (info.energyAvailable >= info.energyCapacity && info.energyCapacity > 0) {
            energyColor = '#FFD700'; // Gold (Full)
        } else if (info.energyPercent < 30) {
            energyColor = '#ff0000'; // Red (Critical)
        } else if (info.energyPercent < 70) {
            energyColor = '#ffff00'; // Yellow (Warning)
        }

        room.visual.text(`⚡ Energy: ${info.energy} (${info.energyPercent}%)`, x, y, {
            font: 0.7,
            color: energyColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // Energy Progress Bar
        const energyBarWidth = 6;
        const energyBarHeight = 0.2;
        const energyProgress = Math.min(info.energyAvailable / info.energyCapacity, 1) || 0;
        room.visual.rect(x, y - 0.1, energyBarWidth, energyBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, energyBarWidth * energyProgress, energyBarHeight, {
            fill: energyColor,
            opacity: 0.8,
        });
        y += 0.6;

        // 📦 Storage info
        let storageColor = '#00ffff'; // Cyan (Healthy)
        if (info.storagePercent >= 100) {
            storageColor = '#FFD700'; // Gold (Full)
        } else if (info.storagePercent < 30) {
            storageColor = '#ff0000'; // Red (Critical)
        } else if (info.storagePercent < 70) {
            storageColor = '#ffff00'; // Yellow (Warning)
        }

        room.visual.text(`📦 Storage: ${info.storage} (${info.storagePercent}%)`, x, y, {
            font: 0.7,
            color: storageColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        // Storage Progress Bar
        const storageBarWidth = 6;
        const storageBarHeight = 0.2;
        const storageProgress = info.storagePercent / 100;
        room.visual.rect(x, y - 0.1, storageBarWidth, storageBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, storageBarWidth * storageProgress, storageBarHeight, {
            fill: storageColor,
            opacity: 0.8,
        });
        y += 0.8;

        // 👥 Creeps info
        room.visual.text(
            `👥 ⛏️:${info.creeps.harvester} ⬆️:${info.creeps.upgrader} 🛠️:${info.creeps.builder} 🔧:${info.creeps.repairer}`,
            x,
            y,
            {
                font: 0.7,
                color: '#ffffff',
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );
        y += 0.8;
        room.visual.text(
            `   🚚:${info.creeps.transporter} 📡:${info.creeps.scout} 💊:${info.creeps.medic} 🗺️:${info.creeps.explorer}`,
            x,
            y,
            {
                font: 0.7,
                color: '#ffffff',
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );

        if (info.hostiles > 0) {
            y++;
            // 🎨 Animation: Pulsing opacity for urgency
            const pulse = 0.7 + 0.3 * Math.sin(Game.time / 3);
            room.visual.text(`⚠️ HOSTILES: ${info.hostiles}`, x, y, {
                font: 0.8,
                color: '#ff0000',
                opacity: pulse,
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.1,
            });
        }

        // 🔋 CPU Bucket
        y += 0.8;
        const bucketProgress = Math.min(info.bucket / 10000, 1);
        const bucketPulse = info.bucket < 1000 ? 0.7 + 0.3 * Math.sin(Game.time / 2) : 1.0;

        room.visual.rect(x, y, 6, 0.2, { fill: '#333333', stroke: '#ffffff', strokeWidth: 0.02 });

        let bucketColor = '#ff0000';
        if (info.bucket > 7000) {
            bucketColor = '#00ff00';
        } else if (info.bucket > 3000) {
            bucketColor = '#ffff00';
        }

        room.visual.rect(x, y, 6 * bucketProgress, 0.2, {
            fill: bucketColor,
            opacity: 0.7 * bucketPulse,
        });
        const bucketPercent = Math.floor(bucketProgress * 100);
        room.visual.text(
            `📊 CPU: ${info.cpuUsed} | Bucket: ${info.bucket} (${bucketPercent}%) | Tick: ${info.tick}`,
            x,
            y + 0.6,
            {
                font: 0.4,
                color: '#ffffff', // 🎨 Accessibility: White text for consistency and contrast
                opacity: bucketPulse,
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );
    },
};

module.exports = DashboardRenderer;
