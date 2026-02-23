const DashboardRenderer = {
  renderRoomDashboard(room) {
    const creeps = room.find(FIND_MY_CREEPS);
    const structures = room.find(FIND_MY_STRUCTURES);
    const hostiles = room.find(FIND_HOSTILE_CREEPS);

    const roleCount = {
      harvester: creeps.filter(c => c.memory.role === 'harvester').length,
      upgrader: creeps.filter(c => c.memory.role === 'upgrader').length,
      builder: creeps.filter(c => c.memory.role === 'builder').length,
      repairer: creeps.filter(c => c.memory.role === 'repairer').length,
    };

    const energyStats = {
      available: room.energyAvailable,
      capacity: room.energyCapacityAvailable,
      storageEnergy: room.storage ? room.storage.store[RESOURCE_ENERGY] : 0,
    };

    const info = {
      room: room.name,
      controller: room.controller ? `RCL ${room.controller.level} (${room.controller.progress}/${room.controller.progressTotal})` : 'None',
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

    room.visual.text(`Room: ${info.room}`, x, y, { font: 0.8, color: '#00ff00', align: 'left' });
    y++;
    room.visual.text(`RCL: ${info.controller}`, x, y, { font: 0.7, color: '#ffff00', align: 'left' });
    y++;
    room.visual.text(`Energy: ${info.energy} | Storage: ${info.storage}`, x, y, { font: 0.7, color: '#00ffff', align: 'left' });
    y++;
    room.visual.text(`H:${info.creeps.harvester} U:${info.creeps.upgrader} B:${info.creeps.builder} R:${info.creeps.repairer}`, x, y, { font: 0.7, color: '#ff00ff', align: 'left' });

    if (info.hostiles > 0) {
      y++;
      room.visual.text(`⚠️ HOSTILES: ${info.hostiles}`, x, y, { font: 0.8, color: '#ff0000', align: 'left' });
    }
  },
};

module.exports = DashboardRenderer;
