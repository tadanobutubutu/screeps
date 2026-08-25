const adaptiveSystem = require('system.adaptive');

/**
 * Formats a number for better readability (e.g., 1000 -> 1.0K, 1000000 -> 1.0M)
 */
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
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
        // ⚡ PERFORMANCE OPTIMIZATION: Leverage pre-warmed room caches from main.js.
        // Redundant per-tick find() calls and role counting removed as they are handled globally.
        const structures = room._myStructures || [];
        const hostiles = room._hostileCreeps || [];
        const roleCount = room._roleCounts || {};

        const energyAvailable = room.energyAvailable;
        const energyCapacity = room.energyCapacityAvailable;
        const storageEnergy = room.storage ? room.storage.store[RESOURCE_ENERGY] : 0;
        const storageCapacity = room.storage ? room.storage.store.getCapacity(RESOURCE_ENERGY) : 0;

        const gclProgress = Game.gcl.progress;
        const gclTotal = Game.gcl.progressTotal;
        const gclPercent = Number(((gclProgress / gclTotal) * 100).toFixed(2));

        const info = {
            room: room.name,
            gcl: {
                level: Game.gcl.level,
                percent: gclPercent,
                progress: gclProgress,
                progressTotal: gclTotal,
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
            energy: `${formatNumber(energyAvailable)}/${formatNumber(energyCapacity)}`,
            energyPercent: energyCapacity
                ? Math.floor((energyAvailable / energyCapacity) * 100)
                : 0,
            energyAvailable,
            energyCapacity,
            storage: formatNumber(storageEnergy),
            storagePercent: storageCapacity
                ? Math.floor((storageEnergy / storageCapacity) * 100)
                : 0,
            creeps: roleCount,
            mode: adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase(),
            bucket: Game.cpu.bucket,
            cpuUsed: Game.cpu.getUsed().toFixed(2),
            tick: Game.time,
        };

        return info;
    },


    _drawBackground(room, x, y, width, height) {
        room.visual.rect(x - 0.5, y - 1, width, height, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });
        return y;
    },

    _drawModeInfo(room, info, x, y) {
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
        return y + 1;
    },

    _drawGCLInfo(room, info, x, y) {
        room.visual.text(`🌐 GCL: ${info.gcl.level} (${info.gcl.percent.toFixed(2)}%)`, x, y, {
            font: 0.7,
            color: '#00aaff',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        const gclBarWidth = 6;
        const gclBarHeight = 0.2;
        const gclProgress = info.gcl.progressTotal ? info.gcl.progress / info.gcl.progressTotal : 0;
        room.visual.rect(x, y - 0.1, gclBarWidth, gclBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, gclBarWidth * gclProgress, gclBarHeight, {
            fill: '#00aaff',
            opacity: 0.8,
        });
        return y + 0.6;
    },

    _drawControllerInfo(room, info, x, y) {
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

        if (info.controller && info.controller.level < 8) {
            const barWidth = 6;
            const barHeight = 0.2;
            const progress = info.controller.progressTotal ? info.controller.progress / info.controller.progressTotal : 0;

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
        return y + 0.8;
    },

    _drawEnergyInfo(room, info, x, y) {
        let energyColor = '#00ffff';
        if (info.energyAvailable >= info.energyCapacity && info.energyCapacity > 0) {
            energyColor = '#FFD700';
        } else if (info.energyPercent < 30) {
            energyColor = '#ff0000';
        } else if (info.energyPercent < 70) {
            energyColor = '#ffff00';
        }

        room.visual.text(`⚡ Energy: ${info.energy} (${info.energyPercent}%)`, x, y, {
            font: 0.7,
            color: energyColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        const energyBarWidth = 6;
        const energyBarHeight = 0.2;
        const energyProgress = info.energyCapacity > 0 ? Math.min(info.energyAvailable / info.energyCapacity, 1) : 0;
        room.visual.rect(x, y - 0.1, energyBarWidth, energyBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, energyBarWidth * energyProgress, energyBarHeight, {
            fill: energyColor,
            opacity: 0.8,
        });
        return y + 0.6;
    },

    _drawStorageInfo(room, info, x, y) {
        let storageColor = '#00ffff';
        if (info.storagePercent >= 100) {
            storageColor = '#FFD700';
        } else if (info.storagePercent < 30) {
            storageColor = '#ff0000';
        } else if (info.storagePercent < 70) {
            storageColor = '#ffff00';
        }

        room.visual.text(`📦 Storage: ${info.storage} (${info.storagePercent}%)`, x, y, {
            font: 0.7,
            color: storageColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

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
        return y + 0.8;
    },

    _drawCreepsInfo(room, info, x, y) {
        room.visual.text(
            `👥 ⛏️:${info.creeps.harvester || 0} ⬆️:${info.creeps.upgrader || 0} 🛠️:${info.creeps.builder || 0} 🔧:${info.creeps.repairer || 0}`,
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
            `   🚚:${info.creeps.transporter || 0} 📡:${info.creeps.scout || 0} 💊:${info.creeps.medic || 0} 🗺️:${info.creeps.explorer || 0}`,
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
        return y;
    },

    _drawHostilesInfo(room, info, x, y) {
        if (info.hostiles > 0) {
            y++;
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
        return y;
    },

    _drawCPUInfo(room, info, x, y) {
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
                color: '#ffffff',
                opacity: bucketPulse,
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );
        return y + 0.6;
    },


    _drawBackground(room, x, y, width, height) {
        room.visual.rect(x - 0.5, y - 1, width, height, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });
        return y;
    },

    _drawModeInfo(room, info, x, y) {
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
        return y + 1;
    },

    _drawGCLInfo(room, info, x, y) {
        room.visual.text(`🌐 GCL: ${info.gcl.level} (${info.gcl.percent.toFixed(2)}%)`, x, y, {
            font: 0.7,
            color: '#00aaff',
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        const gclBarWidth = 6;
        const gclBarHeight = 0.2;
        const gclProgress = info.gcl.progressTotal ? info.gcl.progress / info.gcl.progressTotal : 0;
        room.visual.rect(x, y - 0.1, gclBarWidth, gclBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, gclBarWidth * gclProgress, gclBarHeight, {
            fill: '#00aaff',
            opacity: 0.8,
        });
        return y + 0.6;
    },

    _drawControllerInfo(room, info, x, y) {
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

        if (info.controller && info.controller.level < 8) {
            const barWidth = 6;
            const barHeight = 0.2;
            const progress = info.controller.progressTotal ? info.controller.progress / info.controller.progressTotal : 0;

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
        return y + 0.8;
    },

    _drawEnergyInfo(room, info, x, y) {
        let energyColor = '#00ffff';
        if (info.energyAvailable >= info.energyCapacity && info.energyCapacity > 0) {
            energyColor = '#FFD700';
        } else if (info.energyPercent < 30) {
            energyColor = '#ff0000';
        } else if (info.energyPercent < 70) {
            energyColor = '#ffff00';
        }

        room.visual.text(`⚡ Energy: ${info.energy} (${info.energyPercent}%)`, x, y, {
            font: 0.7,
            color: energyColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

        const energyBarWidth = 6;
        const energyBarHeight = 0.2;
        const energyProgress = info.energyCapacity > 0 ? Math.min(info.energyAvailable / info.energyCapacity, 1) : 0;
        room.visual.rect(x, y - 0.1, energyBarWidth, energyBarHeight, {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 0.02,
        });
        room.visual.rect(x, y - 0.1, energyBarWidth * energyProgress, energyBarHeight, {
            fill: energyColor,
            opacity: 0.8,
        });
        return y + 0.6;
    },

    _drawStorageInfo(room, info, x, y) {
        let storageColor = '#00ffff';
        if (info.storagePercent >= 100) {
            storageColor = '#FFD700';
        } else if (info.storagePercent < 30) {
            storageColor = '#ff0000';
        } else if (info.storagePercent < 70) {
            storageColor = '#ffff00';
        }

        room.visual.text(`📦 Storage: ${info.storage} (${info.storagePercent}%)`, x, y, {
            font: 0.7,
            color: storageColor,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });
        y += 0.4;

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
        return y + 0.8;
    },

    _drawCreepsInfo(room, info, x, y) {
        room.visual.text(
            `👥 ⛏️:${info.creeps.harvester || 0} ⬆️:${info.creeps.upgrader || 0} 🛠️:${info.creeps.builder || 0} 🔧:${info.creeps.repairer || 0}`,
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
            `   🚚:${info.creeps.transporter || 0} 📡:${info.creeps.scout || 0} 💊:${info.creeps.medic || 0} 🗺️:${info.creeps.explorer || 0}`,
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
        return y;
    },

    _drawHostilesInfo(room, info, x, y) {
        if (info.hostiles > 0) {
            y++;
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
        return y;
    },

    _drawCPUInfo(room, info, x, y) {
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
                color: '#ffffff',
                opacity: bucketPulse,
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            }
        );
        return y + 0.6;
    },

    displayVisuals(room) {
        const info = this.renderRoomDashboard(room);

        let y = 2.0;
        const x = 1;
        const width = 8.5;
        const height = 12.2;

        this._drawBackground(room, x, y, width, height);
        y = this._drawModeInfo(room, info, x, y);
        y = this._drawGCLInfo(room, info, x, y);
        y = this._drawControllerInfo(room, info, x, y);
        y = this._drawEnergyInfo(room, info, x, y);
        y = this._drawStorageInfo(room, info, x, y);
        y = this._drawCreepsInfo(room, info, x, y);
        y = this._drawHostilesInfo(room, info, x, y);
        y = this._drawCPUInfo(room, info, x, y);
    },
};

module.exports = DashboardRenderer;
