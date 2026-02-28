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
            transporter: creeps.filter((c) => c.memory.role === 'transporter').length,
            scout: creeps.filter((c) => c.memory.role === 'scout').length,
            medic: creeps.filter((c) => c.memory.role === 'medic').length,
            explorer: creeps.filter((c) => c.memory.role === 'explorer').length,
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

        let y = 2;
        const x = 1;

        // 背景ボックス
        room.visual.rect(x - 0.5, y - 1.5, 9, 7, {
            fill: '#000000',
            opacity: 0.5,
            stroke: '#ffffff',
            strokeWidth: 0.05,
        });

        room.visual.text(`Room: ${info.room}`, x, y, {
            font: 0.8,
            color: '#00ff00',
            align: 'left',
        });
        y++;

        if (info.controller) {
            room.visual.text(`RCL: ${info.controller.level}`, x, y, {
                font: 0.7,
                color: '#ffff00',
                align: 'left',
            });
            vfx.progressBar(
                { x: x + 4, y: y - 0.2, roomName: room.name },
                info.controller.progress,
                info.controller.progressTotal,
                'RCL'
            );
        }
        y++;

        room.visual.text(`Energy: ${info.energy} | Storage: ${info.storage}`, x, y, {
            font: 0.7,
            color: '#00ffff',
            align: 'left',
        });
        y++;

        // Creep counts in two rows
        room.visual.text(
            `H:${info.creeps.harvester} U:${info.creeps.upgrader} B:${info.creeps.builder} R:${info.creeps.repairer}`,
            x,
            y,
            { font: 0.7, color: '#ff00ff', align: 'left' }
        );
        y += 0.8;
        room.visual.text(
            `T:${info.creeps.transporter} S:${info.creeps.scout} M:${info.creeps.medic} E:${info.creeps.explorer}`,
            x,
            y,
            { font: 0.7, color: '#ff00ff', align: 'left' }
        );

        if (info.hostiles > 0) {
            y += 1;
            room.visual.text(`⚠️ HOSTILES: ${info.hostiles}`, x, y, {
                font: 0.8,
                color: '#ff0000',
                align: 'left',
            });
        }
    },
};

module.exports = DashboardRenderer;
