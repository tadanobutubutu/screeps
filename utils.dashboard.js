const vfx = require('visual.effects');

const DashboardRenderer = {
    renderRoomDashboard(room) {
        const creeps = room.find(FIND_MY_CREEPS);
        const structures = room.find(FIND_MY_STRUCTURES);
        const hostiles = room.find(FIND_HOSTILE_CREEPS);

        const roleCount = {
            harvester: creeps.filter((c) => c.memory.role === 'harvester').length,
            upgrader: creeps.filter((c) => c.memory.role === 'upgrader').length,
            builder: creeps.filter((c) => c.memory.role === 'builder').length,
            repairer: creeps.filter((c) => c.memory.role === 'repairer').length,
        };

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
                      progress: room.controller.progress,
                      progressTotal: room.controller.progressTotal,
                  }
                : null,
            hostiles: hostiles.length,
            structures: structures.length,
            energy: `${energyStats.available}/${energyStats.capacity}`,
            storage: energyStats.storageEnergy,
            creeps: roleCount,
        };

        return info;
    },

    displayVisuals(room) {
        const info = this.renderRoomDashboard(room);

        const x = 1;
        let y = 1;

        // 背景ボックス
        room.visual.rect(x - 0.5, y - 0.5, 9, info.controller ? 6 : 5, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });

        room.visual.text(`🏠 Room: ${info.room}`, x, y + 0.5, {
            font: 0.7,
            color: '#ffffff',
            align: 'left',
        });
        y++;

        if (info.controller) {
            room.visual.text(`📈 RCL: ${info.controller.level}`, x, y + 0.5, {
                font: 0.6,
                color: '#ffff00',
                align: 'left',
            });
            vfx.progressBar(
                { x: x + 4, y: y + 0.5, roomName: room.name },
                info.controller.progress,
                info.controller.progressTotal,
                ''
            );
            y++;
        }

        room.visual.text(`⚡ Energy: ${info.energy}`, x, y + 0.5, {
            font: 0.6,
            color: '#00ffff',
            align: 'left',
        });
        y++;

        room.visual.text(`📦 Storage: ${info.storage}`, x, y + 0.5, {
            font: 0.6,
            color: '#00ffff',
            align: 'left',
        });
        y++;

        room.visual.text(
            `👥 H:${info.creeps.harvester} U:${info.creeps.upgrader} B:${info.creeps.builder} R:${info.creeps.repairer}`,
            x,
            y + 0.5,
            { font: 0.6, color: '#ff00ff', align: 'left' }
        );

        if (info.hostiles > 0) {
            y++;
            room.visual.text(`⚠️ HOSTILES: ${info.hostiles}`, x, y + 0.5, {
                font: 0.7,
                color: '#ff0000',
                align: 'left',
            });
        }
    },
};

module.exports = DashboardRenderer;
