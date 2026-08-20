const { CREEP_COUNT, ROLE_PRIORITIES, CONTROLLER_STRUCTURES } = require('src/constants.js');

// Get the current user's subscription information
const subs = _.groupBy(Game.subscribers, s => s);
const owned = _.groupBy(
  Object.values(Game.rooms)
    .filter(r => r.controller && r.controller.my)
    .map(r => r.controller.owner.username),
  _.identity);

const totalBoosts = _.sumBy(
  Object.values(Game.creeps), 
  c => c.spawningTime
);

const totalBodySize = _.sumBy(
  Object.values(Game.creeps),
  c => c.body.length
);

const totalGCL = Object.values(Game.rooms).reduce(
  (sum, room) => {
    if (!room.controller || !room.controller.my) return sum;
    return sum + (room.controller.level <= 8 ? Math.pow(room.controller.level, 2) : 10);
  },
  0
);

// Format numbers with K/M suffixes
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Calculate RCL contribution
function getRCLContribution(controller) {
  if (!controller || !controller.my) return 0;
  if (controller.level >= 8) return 10;
  return Math.pow(controller.level, 2);
}

// Build table structure
const table = [];
const headers = [];

module.exports = function() {
  // Header row - fix scope attributes for accessibility
  table.push([
    new RoomVisual().style(0, 0, { 
      text: 'Room', 
      fontFamily: 'Courier New',
      fontSize: 12 
    }),
    new RoomVisual().style(0, 1, { 
      text: 'GCL',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 2, { 
      text: 'RCL',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 3, { 
      text: 'CPU',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 4, { 
      text: 'Ticks',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 5, { 
      text: 'Bucket',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 6, { 
      text: 'Creeps',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 7, { 
      text: 'Total Body',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 8, { 
      text: 'Parts',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 9, { 
      text: 'Boosts',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
    new RoomVisual().style(0, 10, { 
      text: 'CPU Left',
      fontFamily: 'Courier New', 
      fontSize: 12,
      align: 'left' 
    }),
  ]);

  // Data rows for each room
  for (const room of Object.values(Game.rooms)) {
    if (!room.controller || !room.controller.my) continue;
    
    const rclContribution = getRCLContribution(room.controller);
    const creepsInRoom = Object.values(Game.creeps).filter(c => c.room.name === room.name);
    const bodySize = _.sumBy(creepsInRoom, c => c.body.length);
    const partCount = creepsInRoom.reduce((sum, c) => {
      return sum + c.body.filter(p => p.type === 'work' || p.type === 'carry' || p.type === 'move').length;
    }, 0);
    const spawnTime = _.sumBy(creepsInRoom, c => c.spawningTime || 0);
    
    const row = [
      new RoomVisual().style(0, 0, {
        text: room.name,
        fontFamily: 'Courier New',
        fontSize: 12
      }),
      new RoomVisual().style(0, 1, {
        text: rclContribution.toString(),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 2, {
        text: room.controller.level.toString(),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 3, {
        text: room.cpu.usage.toFixed(1),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 4, {
        text: Game.time.toString(),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 5, {
        text: Game.cpu.bucket.toString(),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 6, {
        text: creepsInRoom.length.toString(),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 7, {
        text: formatNumber(bodySize),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 8, {
        text: formatNumber(partCount),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 9, {
        text: formatNumber(spawnTime),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
      new RoomVisual().style(0, 10, {
        text: Math.max(0, 100 - (room.cpu.usage / room.cpu.limit * 100)).toFixed(1),
        fontFamily: 'Courier New',
        fontSize: 12,
        align: 'left'
      }),
    ];
    
    table.push(row);
  }

  return table;
};

// Get summary stats
module.exports.getSummary = function() {
  return {
    totalRooms: Object.values(Game.rooms).filter(r => r.controller && r.controller.my).length,
    totalGCL: totalGCL,
    totalCPU: Object.values(Game.rooms)
      .filter(r => r.controller && r.controller.my)
      .reduce((sum, room) => sum + room.cpu.usage, 0),
    totalCreeps: Object.keys(Game.creeps).length,
    totalBodySize: totalBodySize,
    totalBoosts: totalBoosts,
    cpuLimit: Game.cpu.limit,
    cpuAvailable: Game.cpu.limit - (Object.values(Game.rooms)
      .filter(r => r.controller && r.controller.my)
      .reduce((sum, room) => sum + room.cpu.usage, 0))
  };
};